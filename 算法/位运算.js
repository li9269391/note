function sum(a, b) {
    if ((a & b) == 0) {
        return a | b
    }
    return sum(a ^ b, (a & b) << 1);
}
