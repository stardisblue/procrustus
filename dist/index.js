"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mathjs_1 = __importDefault(require("mathjs"));
var svd_finder_1 = __importDefault(require("svd-finder"));
// TODO: unsure about the dot mult tho :/
function procrustus(M1, M2, scaling
//   reflection: string | boolean = "best"
) {
    if (scaling === void 0) { scaling = true; }
    var X = mathjs_1.default.matrix(M1);
    var Y = mathjs_1.default.matrix(M2);
    var _a = X.size(), n = _a[0], m = _a[1];
    var _b = Y.size(), ny = _b[0], my = _b[1];
    var muX = mathjs_1.default.mean(X, 0);
    var muY = mathjs_1.default.mean(Y, 0);
    var X0 = mathjs_1.default.subtract(X, muX);
    var Y0 = mathjs_1.default.subtract(Y, muY);
    var ssX = mathjs_1.default.sum(mathjs_1.default.square(X));
    var ssY = mathjs_1.default.sum(mathjs_1.default.square(Y));
    // Centered Frobenius norm
    var normX = mathjs_1.default.sqrt(ssX);
    var normY = mathjs_1.default.sqrt(ssY);
    X0 = mathjs_1.default.divide(X0, normX);
    Y0 = mathjs_1.default.divide(Y0, normY);
    if (my > ny)
        Y0 = mathjs_1.default.concat(Y0, mathjs_1.default.zeros(n, m - my), 0);
    // optimum rotation matrix of Y
    var A = mathjs_1.default.multiply(mathjs_1.default.transpose(X0), Y0);
    var _c = svd_finder_1.default(A), U = _c.u, V = _c.v, s = _c.q;
    var T = mathjs_1.default.multiply(V, mathjs_1.default.transpose(U));
    //   if (reflection !== "best") {
    //     // does the current solution use a reflection?
    //     // if that's not what was specified, force another reflection
    //     if (reflection != mt.det(T) < 0) {
    //     }
    //   }
    var traceTA = mathjs_1.default.sum(s);
    var b, d, Z;
    if (scaling) {
        // optimum scaling of Y
        b = (traceTA * normX) / normY;
        // standarised distance between X and b*Y*T + c
        d = 1 - Math.pow(traceTA, 2);
        // transformed coords
        Z = normX * traceTA * mathjs_1.default.dot(Y0, T) + muX;
    }
    else {
        b = 1;
        d = 1 + ssY / ssX - (2 * traceTA * normY) / normX;
        Z = normY * mathjs_1.default.dot(Y0, T) + muX;
    }
    // transformation matrix
    if (my < m)
        T = T.slice(my);
    var c = muX - b * mathjs_1.default.multiply(muY, T);
    var tform = { rotation: T, scale: b, translation: c };
    return { d: d, Z: Z, tform: tform };
}
exports.default = procrustus;
