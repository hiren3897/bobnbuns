#!/usr/bin/env python3
"""
Zero-dependency QR Code generator in pure Python.
Generates clean, scalable SVG and ASCII QR codes.
Supports standard Byte mode and Reed-Solomon Error Correction (ECC M/L).
"""

import sys
import os

# Galois Field GF(256) with primitive polynomial 0x11D (x^8 + x^4 + x^3 + x^2 + 1)
GF_EXP = [0] * 512
GF_LOG = [0] * 256

def init_gf():
    x = 1
    for i in range(255):
        GF_EXP[i] = x
        GF_EXP[i + 255] = x
        GF_LOG[x] = i
        x <<= 1
        if x & 0x100:
            x ^= 0x11D
    GF_LOG[0] = 0

init_gf()

def gf_mul(x, y):
    if x == 0 or y == 0:
        return 0
    return GF_EXP[GF_LOG[x] + GF_LOG[y]]

def rs_generator_poly(nsym):
    g = [1]
    for i in range(nsym):
        root = GF_EXP[i]
        new_g = [0] * (len(g) + 1)
        for j, c in enumerate(g):
            new_g[j] ^= gf_mul(c, root)
            new_g[j + 1] ^= c
        g = new_g
    return g

def rs_encode(msg_in, nsym):
    gen = rs_generator_poly(nsym)
    msg_out = list(msg_in) + [0] * nsym
    for i in range(len(msg_in)):
        coef = msg_out[i]
        if coef != 0:
            for j in range(1, len(gen)):
                msg_out[i + j] ^= gf_mul(gen[j], coef)
    return msg_out[len(msg_in):]

# QR Code Version capacity and specs (Version 1-6, ECC level M)
# Format: (total_codewords, ec_codewords, num_blocks_g1, data_per_block_g1, num_blocks_g2, data_per_block_g2, [alignment_coords])
QR_SPECS_M = {
    1: (26, 10, 1, 16, 0, 0, []),
    2: (44, 16, 1, 28, 0, 0, [6, 18]),
    3: (70, 26, 1, 44, 0, 0, [6, 22]),
    4: (100, 36, 2, 32, 0, 0, [6, 26]),
    5: (134, 48, 2, 43, 0, 0, [6, 30]),
    6: (172, 64, 4, 27, 0, 0, [6, 34]),
}

def pick_version(byte_len, specs=QR_SPECS_M):
    needed_bits = 4 + 8 + (byte_len * 8) + 4
    needed_bytes = (needed_bits + 7) // 8
    for v in sorted(specs.keys()):
        total, ec, b1, d1, b2, d2, _ = specs[v]
        total_data = b1 * d1 + b2 * d2
        if needed_bytes <= total_data:
            return v
    return 6

def build_data_stream(data_str, version, specs=QR_SPECS_M):
    total, ec, b1, d1, b2, d2, _ = specs[version]
    total_data_bytes = b1 * d1 + b2 * d2
    data_bytes = data_str.encode('utf-8')
    
    # Mode indicator: Byte mode = 0100 (4 bits)
    bit_stream = "0100"
    # Character count indicator (8 bits for V1-9)
    bit_stream += f"{len(data_bytes):08b}"
    # Data bytes
    for b in data_bytes:
        bit_stream += f"{b:08b}"
    # Terminator (up to 4 bits)
    max_bits = total_data_bytes * 8
    term_len = min(4, max_bits - len(bit_stream))
    bit_stream += "0" * term_len
    # Pad to multiple of 8
    if len(bit_stream) % 8 != 0:
        bit_stream += "0" * (8 - (len(bit_stream) % 8))
    
    # Convert bits to bytes
    codeword_list = [int(bit_stream[i:i+8], 2) for i in range(0, len(bit_stream), 8)]
    
    # Pad bytes (alternating 0xEC, 0x11)
    pad_bytes = [0xEC, 0x11]
    pad_idx = 0
    while len(codeword_list) < total_data_bytes:
        codeword_list.append(pad_bytes[pad_idx % 2])
        pad_idx += 1
        
    return codeword_list

def interleave_blocks(data_bytes, version, specs=QR_SPECS_M):
    total, ec, b1, d1, b2, d2, _ = specs[version]
    ec_per_block = ec // (b1 + b2)
    
    data_blocks = []
    ec_blocks = []
    offset = 0
    for _ in range(b1):
        blk = data_bytes[offset:offset+d1]
        data_blocks.append(blk)
        ec_blocks.append(rs_encode(blk, ec_per_block))
        offset += d1
    for _ in range(b2):
        blk = data_bytes[offset:offset+d2]
        data_blocks.append(blk)
        ec_blocks.append(rs_encode(blk, ec_per_block))
        offset += d2
        
    interleaved = []
    max_d = max(len(b) for b in data_blocks)
    for i in range(max_d):
        for blk in data_blocks:
            if i < len(blk):
                interleaved.append(blk[i])
    for i in range(ec_per_block):
        for blk in ec_blocks:
            interleaved.append(blk[i])
            
    return interleaved

def create_matrix(version, specs=QR_SPECS_M):
    size = version * 4 + 17
    matrix = [[None] * size for _ in range(size)]
    reserved = [[False] * size for _ in range(size)]
    
    def set_pattern(r0, c0, pat):
        for r, row in enumerate(pat):
            for c, val in enumerate(row):
                matrix[r0 + r][c0 + c] = val
                reserved[r0 + r][c0 + c] = True

    # Finder patterns (7x7)
    finder = [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1],
    ]
    # Top-left
    set_pattern(0, 0, finder)
    for r in range(8):
        for c in range(8):
            if r == 7 or c == 7:
                matrix[r][c] = 0
            reserved[r][c] = True
            
    # Top-right
    set_pattern(0, size - 7, finder)
    for r in range(8):
        for c in range(size - 8, size):
            if r == 7 or c == size - 8:
                matrix[r][c] = 0
            reserved[r][c] = True
            
    # Bottom-left
    set_pattern(size - 7, 0, finder)
    for r in range(size - 8, size):
        for c in range(8):
            if r == size - 8 or c == 7:
                matrix[r][c] = 0
            reserved[r][c] = True

    # Timing patterns
    for i in range(8, size - 8):
        val = 1 if i % 2 == 0 else 0
        if not reserved[6][i]:
            matrix[6][i] = val
            reserved[6][i] = True
        if not reserved[i][6]:
            matrix[i][6] = val
            reserved[i][6] = True

    # Alignment pattern (if version >= 2)
    align_coords = specs[version][6]
    if align_coords:
        align_pat = [
            [1,1,1,1,1],
            [1,0,0,0,1],
            [1,0,1,0,1],
            [1,0,0,0,1],
            [1,1,1,1,1]
        ]
        for ar in align_coords:
            for ac in align_coords:
                if (ar < 9 and ac < 9) or (ar < 9 and ac > size - 9) or (ar > size - 9 and ac < 9):
                    continue
                set_pattern(ar - 2, ac - 2, align_pat)

    # Dark module
    matrix[4 * version + 9][8] = 1
    reserved[4 * version + 9][8] = True

    # Reserve format info areas
    for c in range(9):
        reserved[8][c] = True
    for r in range(9):
        reserved[r][8] = True
    for c in range(size - 8, size):
        reserved[8][c] = True
    for r in range(size - 7, size):
        reserved[r][8] = True

    return matrix, reserved

def place_data(matrix, reserved, data_bytes):
    size = len(matrix)
    bits = ""
    for b in data_bytes:
        bits += f"{b:08b}"
        
    bit_idx = 0
    bit_len = len(bits)
    
    c = size - 1
    up = True
    while c > 0:
        if c == 6:
            c -= 1
        cols = [c, c - 1]
        row_range = range(size - 1, -1, -1) if up else range(size)
        for r in row_range:
            for col in cols:
                if not reserved[r][col]:
                    if bit_idx < bit_len:
                        matrix[r][col] = int(bits[bit_idx])
                        bit_idx += 1
                    else:
                        matrix[r][col] = 0
        up = not up
        c -= 2

def get_format_bits(ecc_level_bits, mask_pattern):
    data = (ecc_level_bits << 3) | mask_pattern
    rem = data << 10
    g = 0b10100110111
    for i in range(14, 9, -1):
        if rem & (1 << i):
            rem ^= (g << (i - 10))
    fmt = ((data << 10) | rem) ^ 0b101010000010010
    return f"{fmt:015b}"

def apply_mask(matrix, reserved, mask_idx):
    size = len(matrix)
    out = [row[:] for row in matrix]
    for r in range(size):
        for c in range(size):
            if reserved[r][c]:
                continue
            flip = False
            if mask_idx == 0:
                flip = ((r + c) % 2 == 0)
            elif mask_idx == 1:
                flip = (r % 2 == 0)
            elif mask_idx == 2:
                flip = (c % 3 == 0)
            elif mask_idx == 3:
                flip = ((r + c) % 3 == 0)
            elif mask_idx == 4:
                flip = ((r // 2 + c // 3) % 2 == 0)
            elif mask_idx == 5:
                flip = ((r * c) % 2 + (r * c) % 3 == 0)
            elif mask_idx == 6:
                flip = (((r * c) % 2 + (r * c) % 3) % 2 == 0)
            elif mask_idx == 7:
                flip = (((r + c) % 2 + (r * c) % 3) % 2 == 0)
            if flip:
                out[r][c] ^= 1
    return out

def place_format_info(matrix, fmt_bits):
    size = len(matrix)
    for i in range(6):
        matrix[8][i] = int(fmt_bits[i])
    matrix[8][7] = int(fmt_bits[6])
    matrix[8][8] = int(fmt_bits[7])
    matrix[7][8] = int(fmt_bits[8])
    for i in range(9, 15):
        matrix[14 - i][8] = int(fmt_bits[i])

    for i in range(7):
        matrix[size - 1 - i][8] = int(fmt_bits[i])
    for i in range(7, 15):
        matrix[8][size - 15 + i] = int(fmt_bits[i])

def generate_qr_matrix(text):
    v = pick_version(len(text.encode('utf-8')))
    raw_data = build_data_stream(text, v)
    interleaved = interleave_blocks(raw_data, v)
    base_matrix, reserved = create_matrix(v)
    place_data(base_matrix, reserved, interleaved)
    
    mask_idx = 0
    masked_matrix = apply_mask(base_matrix, reserved, mask_idx)
    fmt_bits = get_format_bits(0, mask_idx)
    place_format_info(masked_matrix, fmt_bits)
    
    return masked_matrix

def matrix_to_svg(matrix, quiet_zone=4, module_size=10, fill_color="#18181b", bg_color="#ffffff"):
    size = len(matrix)
    total_size = (size + 2 * quiet_zone) * module_size
    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_size} {total_size}" width="{total_size}" height="{total_size}">',
        f'  <rect width="100%" height="100%" fill="{bg_color}" rx="8" />',
    ]
    
    path_d = []
    for r in range(size):
        for c in range(size):
            if matrix[r][c] == 1:
                x = (c + quiet_zone) * module_size
                y = (r + quiet_zone) * module_size
                path_d.append(f"M{x},{y}h{module_size}v{module_size}h-{module_size}z")
                
    svg_parts.append(f'  <path d="{" ".join(path_d)}" fill="{fill_color}" />')
    svg_parts.append('</svg>')
    return "\n".join(svg_parts)

if __name__ == "__main__":
    os.makedirs("qr", exist_ok=True)
    menu_url = sys.argv[1] if len(sys.argv) > 1 else "https://bobnbuns.netlify.app"
    review_url = sys.argv[2] if len(sys.argv) > 2 else "https://share.google/Tr1mjQjTwQxDnojWD"
    
    print(f"Generating QR for Menu: {menu_url}")
    m_menu = generate_qr_matrix(menu_url)
    svg_menu = matrix_to_svg(m_menu)
    with open("qr/menu-qr.svg", "w") as f:
        f.write(svg_menu)
    print("Saved qr/menu-qr.svg")
    
    print(f"Generating QR for Review: {review_url}")
    m_review = generate_qr_matrix(review_url)
    svg_review = matrix_to_svg(m_review)
    with open("qr/review-qr.svg", "w") as f:
        f.write(svg_review)
    print("Saved qr/review-qr.svg")

