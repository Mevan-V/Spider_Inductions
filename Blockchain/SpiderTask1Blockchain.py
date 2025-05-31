import random

# prime for modulo (finite field arithmetic - mod p, tried to get the biggest prime possible)
PRIME = 208351617316091241234326746312124448251235562226470491514186331217050270460481

def Polynomial(coeffs, x):
    result = 0
    for coeff in reversed(coeffs):
        result = result * x + coeff
    return result

# Fermat theorem for a^-1 % p
def ModInv(a, p):
    return pow(a, p-2, p)

# n = total shares, k = threshold shares to decrypt secret
def Shares(secret, n, k):
    if k > n:
        print("Threshold shares value 'k' should be <= to total shares value 'n'!")
        raise ValueError
    coeffs = [secret] + [random.randrange(1, PRIME) for _ in range(k - 1)]
    shares = [(i, Polynomial(coeffs, i)) for i in range(1, n + 1)]
    return shares

# Lagrange Interpolation
def Decrypt(shares):
    message = 0
    for i, (x, f_x) in enumerate(shares):
        num, denom = 1, 1
        for j, (y, _) in enumerate(shares):
            if (i != j):
                num = (num * (-y)) % PRIME
                denom = (denom * (x - y)) % PRIME
        weight = (num * ModInv(denom, PRIME)) % PRIME
        message = (message + (f_x * weight)) % PRIME
    return int(message)

if __name__ == '__main__':
    secret = 80085
    n, k = 420, 69
    shares = Shares(secret, n, k)
    print(f"Secret with less than k shares = {Decrypt(shares[:k-1])}")
    print(f"Secret with k shares = {Decrypt(shares[:k])}")
    print(f"Correct secrect = {secret}")