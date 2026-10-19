// Exact rational arithmetic, so equation steps never show 0.30000000000000004.

const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));

export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('Division by zero');
    // Allow terminating decimals like 0.25 as input. Count decimal places from the
    // number's shortest text form, so 0.3 becomes 3/10 (not a float-noise loop).
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      const places = (x: number) => (String(+x.toPrecision(12)).split('.')[1] ?? '').length;
      const k = 10 ** Math.min(12, Math.max(places(n), places(d)));
      n = Math.round(n * k);
      d = Math.round(d * k);
    }
    if (d < 0) [n, d] = [-n, -d];
    const k = g(n, d) || 1;
    this.n = n / k;
    this.d = d / k;
  }
  static of(x: number | Frac) {
    return x instanceof Frac ? x : new Frac(x);
  }
  add(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  sub(o: number | Frac) {
    return this.add(Frac.of(o).neg());
  }
  mul(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.n, this.d * b.d);
  }
  div(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d, this.d * b.n);
  }
  neg() {
    return new Frac(-this.n, this.d);
  }
  isZero() {
    return this.n === 0;
  }
  eq(o: number | Frac) {
    const b = Frac.of(o);
    return this.n === b.n && this.d === b.d;
  }
  valueOf() {
    return this.n / this.d;
  }
  /** LaTeX, e.g. -\frac{3}{4} */
  tex() {
    if (this.d === 1) return String(this.n);
    return `${this.n < 0 ? '-' : ''}\\frac{${Math.abs(this.n)}}{${this.d}}`;
  }
  /** Plain text the answer checker understands, e.g. -3/4 */
  text() {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
}

export const F = (n: number, d = 1) => new Frac(n, d);
