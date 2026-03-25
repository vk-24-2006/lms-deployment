import math

def f(x):
    return math.cos(x) - x

# Bisection Method
def bisection(a, b, tol=1e-6):
    while (b - a) / 2 > tol:
        c = (a + b) / 2
        if f(c) == 0:
            return c
        elif f(a) * f(c) < 0:
            b = c
        else:
            a = c
    return (a + b) / 2

# False Position Method
def false_position(a, b, tol=1e-6):
    c = a
    while abs(f(c)) > tol:
        c = (a * f(b) - b * f(a)) / (f(b) - f(a))
        if f(a) * f(c) < 0:
            b = c
        else:
            a = c
    return c

# Newton-Raphson Method
def newton(x0, tol=1e-6):
    x = x0
    while abs(f(x)) > tol:
        x = x - (math.cos(x) - x) / (-math.sin(x) - 1)
    return x

print("Bisection Root:", bisection(0, 1))
print("False Position Root:", false_position(0, 1))
print("Newton-Raphson Root:", newton(0.5))

