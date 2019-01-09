import mt, { Matrix } from "mathjs";
import svd from "svd-finder";

// TODO: unsure about the dot mult tho :/
export default function procrustus(
  M1: number[][],
  M2: number[][],
  scaling: boolean = true
  //   reflection: string | boolean = "best"
) {
  const X = mt.matrix(M1);
  const Y = mt.matrix(M2);

  const [n, m] = X.size();
  const [ny, my] = Y.size();

  const muX = mt.mean(X, 0) as number;
  const muY = mt.mean(Y, 0) as number;

  let X0 = mt.subtract(X, muX) as Matrix;
  let Y0 = mt.subtract(Y, muY) as Matrix;

  const ssX = mt.sum(mt.square(X)) as number;
  const ssY = mt.sum(mt.square(Y)) as number;

  // Centered Frobenius norm
  const normX = mt.sqrt(ssX);
  const normY = mt.sqrt(ssY);

  X0 = mt.divide(X0, normX) as Matrix;
  Y0 = mt.divide(Y0, normY) as Matrix;

  if (my > ny) Y0 = mt.concat(Y0, mt.zeros(n, m - my), 0) as Matrix;

  // optimum rotation matrix of Y
  const A = mt.multiply(mt.transpose(X0), Y0) as number[][];

  const { u: U, v: V, q: s } = svd(A);

  let T = mt.multiply(V, mt.transpose(U)) as number[][];
  //   if (reflection !== "best") {
  //     // does the current solution use a reflection ?
  //     // if that's not what was specified, force another reflection
  //     if (reflection != mt.det(T) < 0) {

  //     }
  //   }

  const traceTA = mt.sum(s) as number;

  let b, d, Z;

  if (scaling) {
    // optimum scaling of Y
    b = (traceTA * normX) / normY;

    // standarised distance between X and b*Y*T + c
    d = 1 - traceTA ** 2;

    // transformed coords
    Z = normX * traceTA * mt.dot(Y0, T) + muX;
  } else {
    b = 1;
    d = 1 + ssY / ssX - (2 * traceTA * normY) / normX;
    Z = normY * mt.dot(Y0, T) + muX;
  }

  // transformation matrix
  if (my < m) T = T.slice(my);

  const c = muX - b * (mt.multiply(muY, T) as number);

  const tform = { rotation: T, scale: b, translation: c };

  return { d, Z, tform };
}
