// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/fp-ts/lib/function.js":[function(require,module,exports) {
"use strict";
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindTo_ = exports.bind_ = exports.hole = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.not = exports.unsafeCoerce = exports.identity = void 0;
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
exports.identity = identity;
/**
 * @since 2.0.0
 */
exports.unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
exports.not = not;
/**
 * @since 2.0.0
 */
function constant(a) {
    return function () { return a; };
}
exports.constant = constant;
/**
 * A thunk that returns always `true`.
 *
 * @since 2.0.0
 */
exports.constTrue = 
/*#__PURE__*/
constant(true);
/**
 * A thunk that returns always `false`.
 *
 * @since 2.0.0
 */
exports.constFalse = 
/*#__PURE__*/
constant(false);
/**
 * A thunk that returns always `null`.
 *
 * @since 2.0.0
 */
exports.constNull = 
/*#__PURE__*/
constant(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @since 2.0.0
 */
exports.constUndefined = 
/*#__PURE__*/
constant(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @since 2.0.0
 */
exports.constVoid = exports.constUndefined;
// TODO: remove in v3
/**
 * Flips the order of the arguments of a function of two arguments.
 *
 * @since 2.0.0
 */
function flip(f) {
    return function (b, a) { return f(a, b); };
}
exports.flip = flip;
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
exports.flow = flow;
/**
 * @since 2.0.0
 */
function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
}
exports.tuple = tuple;
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
exports.increment = increment;
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
exports.decrement = decrement;
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
exports.absurd = absurd;
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
function tupled(f) {
    return function (a) { return f.apply(void 0, a); };
}
exports.tupled = tupled;
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
function untupled(f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return f(a);
    };
}
exports.untupled = untupled;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi, ij, jk, kl, lm, mn, no, op, pq, qr, rs, st) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
        case 11:
            return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
        case 12:
            return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
        case 13:
            return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))));
        case 14:
            return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))));
        case 15:
            return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))));
        case 16:
            return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))));
        case 17:
            return pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))));
        case 18:
            return qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))));
        case 19:
            return rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))));
        case 20:
            return st(rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))));
    }
    return;
}
exports.pipe = pipe;
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
exports.hole = absurd;
/**
 * @internal
 */
var bind_ = function (a, name, b) {
    var _a;
    return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
};
exports.bind_ = bind_;
/**
 * @internal
 */
var bindTo_ = function (name) { return function (b) {
    var _a;
    return (_a = {}, _a[name] = b, _a);
}; };
exports.bindTo_ = bindTo_;

},{}],"../node_modules/fp-ts/lib/Option.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplySemigroup = exports.getOrd = exports.getEq = exports.getShow = exports.URI = exports.wilt = exports.wither = exports.sequence = exports.traverse = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.separate = exports.compact = exports.reduceRight = exports.foldMap = exports.reduce = exports.duplicate = exports.extend = exports.throwError = exports.zero = exports.alt = exports.altW = exports.flatten = exports.chainFirst = exports.chain = exports.of = exports.apSecond = exports.apFirst = exports.ap = exports.map = exports.chainNullableK = exports.mapNullable = exports.fromNullableK = exports.getOrElse = exports.getOrElseW = exports.toUndefined = exports.toNullable = exports.fold = exports.fromEither = exports.getRight = exports.getLeft = exports.tryCatch = exports.fromPredicate = exports.fromNullable = exports.some = exports.none = exports.isNone = exports.isSome = void 0;
exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.getRefinement = exports.exists = exports.elem = exports.option = exports.MonadThrow = exports.Witherable = exports.Traversable = exports.Filterable = exports.Compactable = exports.Extend = exports.Alternative = exports.Alt = exports.Foldable = exports.Monad = exports.Applicative = exports.Functor = exports.getMonoid = exports.getLastMonoid = exports.getFirstMonoid = exports.getApplyMonoid = void 0;
var function_1 = require("./function");
// -------------------------------------------------------------------------------------
// guards
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise.
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @category guards
 * @since 2.0.0
 */
var isSome = function (fa) { return fa._tag === 'Some'; };
exports.isSome = isSome;
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category guards
 * @since 2.0.0
 */
var isNone = function (fa) { return fa._tag === 'None'; };
exports.isNone = isNone;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.none = { _tag: 'None' };
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
var some = function (a) { return ({ _tag: 'Some', value: a }); };
exports.some = some;
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category constructors
 * @since 2.0.0
 */
function fromNullable(a) {
    return a == null ? exports.none : exports.some(a);
}
exports.fromNullable = fromNullable;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? exports.some(a) : exports.none); };
}
exports.fromPredicate = fromPredicate;
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
 * `Some`.
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @category constructors
 * @since 2.0.0
 */
function tryCatch(f) {
    try {
        return exports.some(f());
    }
    catch (e) {
        return exports.none;
    }
}
exports.tryCatch = tryCatch;
/**
 * Returns the `Left` value of an `Either` if possible.
 *
 * @example
 * import { getLeft, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 *
 * @category constructors
 * @since 2.0.0
 */
function getLeft(ma) {
    return ma._tag === 'Right' ? exports.none : exports.some(ma.left);
}
exports.getLeft = getLeft;
/**
 * Returns the `Right` value of an `Either` if possible.
 *
 * @example
 * import { getRight, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(left('a')), none)
 *
 * @category constructors
 * @since 2.0.0
 */
function getRight(ma) {
    return ma._tag === 'Left' ? exports.none : exports.some(ma.right);
}
exports.getRight = getRight;
/**
 * Transforms an `Either` to an `Option` discarding the error.
 *
 * Alias of [getRight](#getRight)
 *
 * Derivable from `MonadThrow`.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.fromEither = getRight;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, fold } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     fold(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     fold(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
function fold(onNone, onSome) {
    return function (ma) { return (exports.isNone(ma) ? onNone() : onSome(ma.value)); };
}
exports.fold = fold;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNullable } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNullable
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNullable
 *   ),
 *   null
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
function toNullable(ma) {
    return exports.isNone(ma) ? null : ma.value;
}
exports.toNullable = toNullable;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
function toUndefined(ma) {
    return exports.isNone(ma) ? undefined : ma.value;
}
exports.toUndefined = toUndefined;
/**
 * Less strict version of [`getOrElse`](#getOrElse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW = function (onNone) { return function (ma) { return (exports.isNone(ma) ? onNone() : ma.value); }; };
exports.getOrElseW = getOrElseW;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = exports.getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns a *smart constructor* from a function that returns a nullable value.
 *
 * @example
 * import { fromNullableK, none, some } from 'fp-ts/Option'
 *
 * const f = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const g = fromNullableK(f)
 *
 * assert.deepStrictEqual(g('1'), some(1))
 * assert.deepStrictEqual(g('a'), none)
 *
 * @category combinators
 * @since 2.9.0
 */
function fromNullableK(f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return fromNullable(f.apply(void 0, a));
    };
}
exports.fromNullableK = fromNullableK;
/**
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
exports.mapNullable = chainNullableK;
/**
 * This is `chain` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, fromNullable, chainNullableK } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Employee {
 *   company?: {
 *     address?: {
 *       street?: {
 *         name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   none
 * )
 *
 * @category combinators
 * @since 2.9.0
 */
function chainNullableK(f) {
    return function (ma) { return (exports.isNone(ma) ? exports.none : fromNullable(f(ma.value))); };
}
exports.chainNullableK = chainNullableK;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var map_ = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
var ap_ = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var chain_ = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
var reduce_ = function (fa, b, f) { return function_1.pipe(fa, exports.reduce(b, f)); };
var foldMap_ = function (M) {
    var foldMapM = exports.foldMap(M);
    return function (fa, f) { return function_1.pipe(fa, foldMapM(f)); };
};
var reduceRight_ = function (fa, b, f) { return function_1.pipe(fa, exports.reduceRight(b, f)); };
var traverse_ = function (F) {
    var traverseF = exports.traverse(F);
    return function (ta, f) { return function_1.pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var alt_ = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
var filter_ = function (fa, predicate) {
    return function_1.pipe(fa, exports.filter(predicate));
};
/* istanbul ignore next */
var filterMap_ = function (fa, f) { return function_1.pipe(fa, exports.filterMap(f)); };
/* istanbul ignore next */
var extend_ = function (wa, f) { return function_1.pipe(wa, exports.extend(f)); };
/* istanbul ignore next */
var partition_ = function (fa, predicate) { return function_1.pipe(fa, exports.partition(predicate)); };
/* istanbul ignore next */
var partitionMap_ = function (fa, f) { return function_1.pipe(fa, exports.partitionMap(f)); };
/* istanbul ignore next */
var wither_ = function (F) {
    var witherF = exports.wither(F);
    return function (fa, f) { return function_1.pipe(fa, witherF(f)); };
};
/* istanbul ignore next */
var wilt_ = function (F) {
    var wiltF = exports.wilt(F);
    return function (fa, f) { return function_1.pipe(fa, wiltF(f)); };
};
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return exports.isNone(fa) ? exports.none : exports.some(f(fa.value));
}; };
exports.map = map;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) {
    return exports.isNone(fab) ? exports.none : exports.isNone(fa) ? exports.none : exports.some(fab.value(fa.value));
}; };
exports.ap = ap;
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apFirst = function (fb) {
    return function_1.flow(exports.map(function (a) { return function () { return a; }; }), exports.ap(fb));
};
exports.apFirst = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apSecond = function (fb) {
    return function_1.flow(exports.map(function () { return function (b) { return b; }; }), exports.ap(fb));
};
exports.apSecond = apSecond;
/**
 * Wrap a value into the type constructor.
 *
 * @category Applicative
 * @since 2.7.0
 */
exports.of = exports.some;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) {
    return exports.isNone(ma) ? exports.none : f(ma.value);
}; };
exports.chain = chain;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 2.0.0
 */
var chainFirst = function (f) {
    return exports.chain(function (a) {
        return function_1.pipe(f(a), exports.map(function () { return a; }));
    });
};
exports.chainFirst = chainFirst;
/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(function_1.identity);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) {
    return exports.isNone(fa) ? that() : fa;
}; };
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Option` returns the left-most non-`None` value.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('a')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('b')
 * )
 *
 * @category Alt
 * @since 2.0.0
 */
exports.alt = exports.altW;
/**
 * @category Alternative
 * @since 2.7.0
 */
var zero = function () { return exports.none; };
exports.zero = zero;
/**
 * @category MonadThrow
 * @since 2.7.0
 */
var throwError = function () { return exports.none; };
exports.throwError = throwError;
/**
 * @category Extend
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return exports.isNone(wa) ? exports.none : exports.some(f(wa));
}; };
exports.extend = extend;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.duplicate = 
/*#__PURE__*/
exports.extend(function_1.identity);
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return exports.isNone(fa) ? b : f(b, fa.value);
}; };
exports.reduce = reduce;
/**
 * @category Foldable
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return exports.isNone(fa) ? M.empty : f(fa.value);
}; }; };
exports.foldMap = foldMap;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return exports.isNone(fa) ? b : f(fa.value, b);
}; };
exports.reduceRight = reduceRight;
/**
 * @category Compactable
 * @since 2.0.0
 */
exports.compact = exports.flatten;
var defaultSeparate = { left: exports.none, right: exports.none };
/**
 * @category Compactable
 * @since 2.0.0
 */
var separate = function (ma) {
    var o = function_1.pipe(ma, exports.map(function (e) { return ({
        left: getLeft(e),
        right: getRight(e)
    }); }));
    return exports.isNone(o) ? defaultSeparate : o.value;
};
exports.separate = separate;
/**
 * @category Filterable
 * @since 2.0.0
 */
var filter = function (predicate) { return function (fa) { return (exports.isNone(fa) ? exports.none : predicate(fa.value) ? fa : exports.none); }; };
exports.filter = filter;
/**
 * @category Filterable
 * @since 2.0.0
 */
var filterMap = function (f) { return function (fa) {
    return exports.isNone(fa) ? exports.none : f(fa.value);
}; };
exports.filterMap = filterMap;
/**
 * @category Filterable
 * @since 2.0.0
 */
var partition = function (predicate) { return function (fa) {
    return {
        left: filter_(fa, function (a) { return !predicate(a); }),
        right: filter_(fa, predicate)
    };
}; };
exports.partition = partition;
/**
 * @category Filterable
 * @since 2.0.0
 */
var partitionMap = function (f) { return function_1.flow(exports.map(f), exports.separate); };
exports.partitionMap = partitionMap;
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse = function (F) { return function (f) { return function (ta) { return (exports.isNone(ta) ? F.of(exports.none) : F.map(f(ta.value), exports.some)); }; }; };
exports.traverse = traverse;
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence = function (F) { return function (ta) { return (exports.isNone(ta) ? F.of(exports.none) : F.map(ta.value, exports.some)); }; };
exports.sequence = sequence;
/**
 * @category Witherable
 * @since 2.6.5
 */
var wither = function (F) { return function (f) { return function (fa) { return (exports.isNone(fa) ? F.of(exports.none) : f(fa.value)); }; }; };
exports.wither = wither;
/**
 * @category Witherable
 * @since 2.6.5
 */
var wilt = function (F) { return function (f) { return function (fa) {
    return exports.isNone(fa)
        ? F.of({
            left: exports.none,
            right: exports.none
        })
        : F.map(f(fa.value), function (e) { return ({
            left: getLeft(e),
            right: getRight(e)
        }); });
}; }; };
exports.wilt = wilt;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Option';
/**
 * @category instances
 * @since 2.0.0
 */
function getShow(S) {
    return {
        show: function (ma) { return (exports.isNone(ma) ? 'none' : "some(" + S.show(ma.value) + ")"); }
    };
}
exports.getShow = getShow;
/**
 * @example
 * import { none, some, getEq } from 'fp-ts/Option'
 * import { eqNumber } from 'fp-ts/Eq'
 *
 * const E = getEq(eqNumber)
 * assert.strictEqual(E.equals(none, none), true)
 * assert.strictEqual(E.equals(none, some(1)), false)
 * assert.strictEqual(E.equals(some(1), none), false)
 * assert.strictEqual(E.equals(some(1), some(2)), false)
 * assert.strictEqual(E.equals(some(1), some(1)), true)
 *
 * @category instances
 * @since 2.0.0
 */
function getEq(E) {
    return {
        equals: function (x, y) { return x === y || (exports.isNone(x) ? exports.isNone(y) : exports.isNone(y) ? false : E.equals(x.value, y.value)); }
    };
}
exports.getEq = getEq;
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/Option'
 * import { ordNumber } from 'fp-ts/Ord'
 *
 * const O = getOrd(ordNumber)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @category instances
 * @since 2.0.0
 */
function getOrd(O) {
    return {
        equals: getEq(O).equals,
        compare: function (x, y) { return (x === y ? 0 : exports.isSome(x) ? (exports.isSome(y) ? O.compare(x.value, y.value) : 1) : -1); }
    };
}
exports.getOrd = getOrd;
/**
 * `Apply` semigroup
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | none               |
 * | none    | some(a) | none               |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getApplySemigroup, some, none } from 'fp-ts/Option'
 * import { semigroupSum } from 'fp-ts/Semigroup'
 *
 * const S = getApplySemigroup(semigroupSum)
 * assert.deepStrictEqual(S.concat(none, none), none)
 * assert.deepStrictEqual(S.concat(some(1), none), none)
 * assert.deepStrictEqual(S.concat(none, some(1)), none)
 * assert.deepStrictEqual(S.concat(some(1), some(2)), some(3))
 *
 * @category instances
 * @since 2.0.0
 */
function getApplySemigroup(S) {
    return {
        concat: function (x, y) { return (exports.isSome(x) && exports.isSome(y) ? exports.some(S.concat(x.value, y.value)) : exports.none); }
    };
}
exports.getApplySemigroup = getApplySemigroup;
/**
 * @category instances
 * @since 2.0.0
 */
function getApplyMonoid(M) {
    return {
        concat: getApplySemigroup(M).concat,
        empty: exports.some(M.empty)
    };
}
exports.getApplyMonoid = getApplyMonoid;
/**
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @category instances
 * @since 2.0.0
 */
function getFirstMonoid() {
    return {
        concat: function (x, y) { return (exports.isNone(x) ? y : x); },
        empty: exports.none
    };
}
exports.getFirstMonoid = getFirstMonoid;
/**
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @category instances
 * @since 2.0.0
 */
function getLastMonoid() {
    return {
        concat: function (x, y) { return (exports.isNone(y) ? x : y); },
        empty: exports.none
    };
}
exports.getLastMonoid = getLastMonoid;
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(a) | some(a)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/Option'
 * import { semigroupSum } from 'fp-ts/Semigroup'
 *
 * const M = getMonoid(semigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @category instances
 * @since 2.0.0
 */
function getMonoid(S) {
    return {
        concat: function (x, y) { return (exports.isNone(x) ? y : exports.isNone(y) ? x : exports.some(S.concat(x.value, y.value))); },
        empty: exports.none
    };
}
exports.getMonoid = getMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: map_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of,
    chain: chain_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alternative = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of,
    alt: alt_,
    zero: exports.zero
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: map_,
    extend: extend_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Filterable = {
    URI: exports.URI,
    map: map_,
    compact: exports.compact,
    separate: exports.separate,
    filter: filter_,
    filterMap: filterMap_,
    partition: partition_,
    partitionMap: partitionMap_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: map_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports.sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Witherable = {
    URI: exports.URI,
    map: map_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports.sequence,
    compact: exports.compact,
    separate: exports.separate,
    filter: filter_,
    filterMap: filterMap_,
    partition: partition_,
    partitionMap: partitionMap_,
    wither: wither_,
    wilt: wilt_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of,
    chain: chain_,
    throwError: exports.throwError
};
// TODO: remove in v3
/**
 * @category instances
 * @since 2.0.0
 */
exports.option = {
    URI: exports.URI,
    map: map_,
    of: exports.of,
    ap: ap_,
    chain: chain_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports.sequence,
    zero: exports.zero,
    alt: alt_,
    extend: extend_,
    compact: exports.compact,
    separate: exports.separate,
    filter: filter_,
    filterMap: filterMap_,
    partition: partition_,
    partitionMap: partitionMap_,
    wither: wither_,
    wilt: wilt_,
    throwError: exports.throwError
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if `ma` contains `a`
 *
 * @example
 * import { some, none, elem } from 'fp-ts/Option'
 * import { eqNumber } from 'fp-ts/Eq'
 *
 * assert.strictEqual(elem(eqNumber)(1, some(1)), true)
 * assert.strictEqual(elem(eqNumber)(2, some(1)), false)
 * assert.strictEqual(elem(eqNumber)(1, none), false)
 *
 * @since 2.0.0
 */
function elem(E) {
    return function (a, ma) { return (exports.isNone(ma) ? false : E.equals(a, ma.value)); };
}
exports.elem = elem;
/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 2.0.0
 */
function exists(predicate) {
    return function (ma) { return (exports.isNone(ma) ? false : predicate(ma.value)); };
}
exports.exists = exists;
/**
 * Returns a `Refinement` (i.e. a custom type guard) from a `Option` returning function.
 * This function ensures that a custom type guard definition is type-safe.
 *
 * ```ts
 * import { some, none, getRefinement } from 'fp-ts/Option'
 *
 * type A = { type: 'A' }
 * type B = { type: 'B' }
 * type C = A | B
 *
 * const isA = (c: C): c is A => c.type === 'B' // <= typo but typescript doesn't complain
 * const isA = getRefinement<C, A>(c => (c.type === 'B' ? some(c) : none)) // static error: Type '"B"' is not assignable to type '"A"'
 * ```
 *
 * @since 2.0.0
 */
function getRefinement(getOption) {
    return function (a) { return exports.isSome(getOption(a)); };
}
exports.getRefinement = getRefinement;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
exports.Do = 
/*#__PURE__*/
exports.of({});
/**
 * @since 2.8.0
 */
var bindTo = function (name) { return exports.map(function_1.bindTo_(name)); };
exports.bindTo = bindTo;
/**
 * @since 2.8.0
 */
var bind = function (name, f) {
    return exports.chain(function (a) {
        return function_1.pipe(f(a), exports.map(function (b) { return function_1.bind_(a, name, b); }));
    });
};
exports.bind = bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS = function (name, fb) {
    return function_1.flow(exports.map(function (a) { return function (b) { return function_1.bind_(a, name, b); }; }), exports.ap(fb));
};
exports.apS = apS;
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 *
 * @since 2.9.0
 */
var traverseArrayWithIndex = function (f) { return function (arr) {
    // tslint:disable-next-line: readonly-array
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        var b = f(i, arr[i]);
        if (exports.isNone(b)) {
            return exports.none;
        }
        result.push(b.value);
    }
    return exports.some(result);
}; };
exports.traverseArrayWithIndex = traverseArrayWithIndex;
/**
 * Runs an action for every element in array and accumulates the results in option
 *
 * this function has the same behavior of `A.sequence(O.option)` but it's optimized and performs better
 *
 * @example
 *
 * import * as A from 'fp-ts/Array'
 * import { traverseArray, some, fromPredicate, none } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * const arr = A.range(0, 10)
 * assert.deepStrictEqual(pipe(arr, traverseArray(some)), some(arr))
 * assert.deepStrictEqual(pipe(arr, traverseArray(fromPredicate((x) => x > 5))), none)
 *
 * @since 2.9.0
 */
var traverseArray = function (f) { return exports.traverseArrayWithIndex(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * get an array of option and convert it to option of array
 *
 * this function has the same behavior of `A.sequence(O.option)` but it's optimized and performs better
 *
 * @example
 *
 * import * as A from 'fp-ts/Array'
 * import { sequenceArray, some, none, fromPredicate } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * const arr = A.range(0, 10)
 * assert.deepStrictEqual(pipe(arr, A.map(some), sequenceArray), some(arr))
 * assert.deepStrictEqual(pipe(arr, A.map(fromPredicate(x => x > 8)), sequenceArray), none)
 *
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(function_1.identity);

},{"./function":"../node_modules/fp-ts/lib/function.js"}],"../lib/ctx-util.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawDisc = exports.pathPolyline = exports.pathPolygon = void 0;

exports.pathPolygon = function (ctx, polygon) {
  exports.pathPolyline(ctx, polygon);
  ctx.closePath();
};

exports.pathPolyline = function (ctx, polyline) {
  ctx.beginPath();
  ctx.moveTo.apply(ctx, polyline[0]);
  polyline.slice(1).map(function (point) {
    return ctx.lineTo.apply(ctx, point);
  });
};

function drawDisc(ctx, point, radius, style) {
  if (style) {
    Object.assign(ctx, style);
  }

  ctx.beginPath();
  ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
  ctx.fill();
}

exports.drawDisc = drawDisc;
},{}],"../lib/vec3.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.round = exports.interpolate = exports.project = exports.cross = exports.dot = exports.distance = exports.normalize = exports.sqrdMagnitude = exports.magnitude = exports.equal = exports.isZero = exports.divide = exports.subtract = exports.multiply = exports.sum = exports.add = void 0;

exports.add = function (a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

function sum(vectors) {
  var sum = [0, 0, 0];

  for (var _i = 0, vectors_1 = vectors; _i < vectors_1.length; _i++) {
    var vec = vectors_1[_i];
    sum[0] += vec[0];
    sum[1] += vec[1];
    sum[2] += vec[2];
  }

  return sum;
}

exports.sum = sum;

exports.multiply = function (vector, scalar) {
  return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
};

exports.subtract = function (a, b) {
  return exports.add(a, exports.multiply(b, -1));
};

exports.divide = function (vector, denominator) {
  return exports.multiply(vector, 1 / denominator);
};

exports.isZero = function (vector) {
  return vector.every(function (component) {
    return component === 0;
  });
};

exports.equal = function (a, b) {
  return exports.isZero(exports.subtract(a, b));
};

exports.magnitude = function (vector) {
  return Math.hypot.apply(Math, vector);
};

exports.sqrdMagnitude = function (v) {
  return Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2);
};

exports.normalize = function (vector) {
  return exports.isZero(vector) ? [0, 0, 0] : exports.divide(vector, exports.magnitude(vector));
};

exports.distance = function (a, b) {
  return exports.magnitude(exports.subtract(a, b));
};

exports.dot = function (a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

exports.cross = function (a, b) {
  return [a[1] * b[2] - b[1] * a[2], a[2] * b[0] - b[2] * a[0], a[0] * b[1] - b[0] * a[1]];
};

exports.project = function (normal, point) {
  return exports.multiply(normal, exports.dot(normal, point));
};

exports.interpolate = function (a, b, t) {
  return exports.add(a, exports.multiply(exports.subtract(b, a), t));
};

exports.round = function (v) {
  return v.map(Math.round);
};
},{}],"../lib/mat3x3.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotation = exports.inverse = exports.multiplyMatrix = exports.multiplyVector = exports.identity = void 0;

var Vec3 = __importStar(require("./vec3"));

exports.identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];

exports.multiplyVector = function (matrix, vector) {
  return [matrix[0] * vector[0] + matrix[3] * vector[1] + matrix[6] * vector[2], matrix[1] * vector[0] + matrix[4] * vector[1] + matrix[7] * vector[2], matrix[2] * vector[0] + matrix[5] * vector[1] + matrix[8] * vector[2]];
};

exports.multiplyMatrix = function (a, b) {
  return __spreadArrays(exports.multiplyVector(a, b.slice(0, 3)), exports.multiplyVector(a, b.slice(3, 6)), exports.multiplyVector(a, b.slice(6, 9)));
};

exports.inverse = function (matrix) {
  var a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      e = matrix[4],
      f = matrix[5],
      g = matrix[6],
      h = matrix[7],
      i = matrix[8];
  var vals = [e * i - f * h, f * g - i * d, h * d - g * e, b * i - c * h, c * g - a * i, h * a - g * b, e * c - f * b, f * a - d * c, b * d - a * e];
  var m = 1 / (a * vals[0] + b * vals[1] + c * vals[2]);
  var n = 1 / (d * vals[3] + e * vals[4] + f * vals[5]);
  var o = 1 / (g * vals[6] + h * vals[7] + i * vals[8]);
  return [vals[0] * m, vals[3] * n, vals[6] * o, vals[1] * m, vals[4] * n, vals[7] * o, vals[2] * m, vals[5] * n, vals[8] * o];
};

var rotateVector = function rotateVector(axis, angle) {
  return function (vec) {
    var sinDir = Vec3.normalize(Vec3.cross(axis, vec));
    var axisCenter = Vec3.multiply(axis, Vec3.dot(axis, vec));
    var cosDir = Vec3.normalize(Vec3.subtract(vec, axisCenter));
    var _a = [Math.sin(angle), Math.cos(angle)],
        sin = _a[0],
        cos = _a[1];
    var radius = Vec3.distance(axisCenter, vec);
    return Vec3.add(axisCenter, Vec3.multiply(Vec3.add(Vec3.multiply(sinDir, sin), Vec3.multiply(cosDir, cos)), radius));
  };
};

exports.rotation = function (vector) {
  if (Vec3.isZero(vector)) {
    return exports.identity;
  }

  var axis = Vec3.normalize(vector);
  var angle = Vec3.magnitude(vector);
  var rotateFunc = rotateVector(axis, angle);
  return __spreadArrays(rotateFunc([1, 0, 0]), rotateFunc([0, 1, 0]), rotateFunc([0, 0, 1]));
};
},{"./vec3":"../lib/vec3.ts"}],"camera/orbit-camera.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRegularCamera = void 0;

var mat3x3_1 = require("../../lib/mat3x3");

var Vec3 = __importStar(require("../../lib/vec3"));

function calculateOrientation(orbitCam) {
  var rotationMatrix1 = mat3x3_1.rotation([0, orbitCam.longitude, 0]);
  var rotationMatrix2 = mat3x3_1.rotation([orbitCam.latitude, 0, 0]);
  return mat3x3_1.multiplyMatrix(rotationMatrix1, rotationMatrix2);
}

function calculateTransform(orbitCam) {
  var orientation = calculateOrientation(orbitCam);
  var forward = orientation.slice(6);
  var position = Vec3.multiply(forward, -orbitCam.radius);
  return {
    position: position,
    orientation: orientation
  };
}

function toRegularCamera(orbitCam) {
  var transform = calculateTransform(orbitCam);
  return {
    transform: transform,
    inverseMatrix: mat3x3_1.inverse(transform.orientation)
  };
}

exports.toRegularCamera = toRegularCamera;
},{"../../lib/mat3x3":"../lib/mat3x3.ts","../../lib/vec3":"../lib/vec3.ts"}],"voxel/voxel-face.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNonZeroIndex = exports.voxelFaceNormals = void 0;
exports.voxelFaceNormals = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

function getNonZeroIndex(normal) {
  for (var i = 0; i < 3; i++) {
    if (normal[i] !== 0) return i;
  }
}

exports.getNonZeroIndex = getNonZeroIndex;
},{}],"../node_modules/fp-ts/lib/Ordering.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invert = exports.monoidOrdering = exports.semigroupOrdering = exports.eqOrdering = exports.sign = void 0;
/**
 * @since 2.0.0
 */
function sign(n) {
    return n <= -1 ? -1 : n >= 1 ? 1 : 0;
}
exports.sign = sign;
/**
 * @category instances
 * @since 2.0.0
 */
exports.eqOrdering = {
    equals: function (x, y) { return x === y; }
};
/**
 * Use `monoidOrdering` instead
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupOrdering = {
    concat: function (x, y) { return (x !== 0 ? x : y); }
};
/**
 * @category instances
 * @since 2.4.0
 */
exports.monoidOrdering = {
    // tslint:disable-next-line: deprecation
    concat: exports.semigroupOrdering.concat,
    empty: 0
};
/**
 * @since 2.0.0
 */
function invert(O) {
    switch (O) {
        case -1:
            return 1;
        case 1:
            return -1;
        default:
            return 0;
    }
}
exports.invert = invert;

},{}],"../node_modules/fp-ts/lib/Ord.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ord = exports.Contravariant = exports.ordDate = exports.URI = exports.contramap = exports.getDualOrd = exports.getTupleOrd = exports.getMonoid = exports.getSemigroup = exports.fromCompare = exports.between = exports.clamp = exports.max = exports.min = exports.geq = exports.leq = exports.gt = exports.lt = exports.ordBoolean = exports.ordNumber = exports.ordString = void 0;
var Ordering_1 = require("./Ordering");
var function_1 = require("./function");
// default compare for primitive types
function compare(x, y) {
    return x < y ? -1 : x > y ? 1 : 0;
}
function strictEqual(a, b) {
    return a === b;
}
/**
 * @category instances
 * @since 2.0.0
 */
exports.ordString = {
    equals: strictEqual,
    compare: compare
};
/**
 * @category instances
 * @since 2.0.0
 */
exports.ordNumber = {
    equals: strictEqual,
    compare: compare
};
/**
 * @category instances
 * @since 2.0.0
 */
exports.ordBoolean = {
    equals: strictEqual,
    compare: compare
};
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
function lt(O) {
    return function (x, y) { return O.compare(x, y) === -1; };
}
exports.lt = lt;
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
function gt(O) {
    return function (x, y) { return O.compare(x, y) === 1; };
}
exports.gt = gt;
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
function leq(O) {
    return function (x, y) { return O.compare(x, y) !== 1; };
}
exports.leq = leq;
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
function geq(O) {
    return function (x, y) { return O.compare(x, y) !== -1; };
}
exports.geq = geq;
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
function min(O) {
    return function (x, y) { return (O.compare(x, y) === 1 ? y : x); };
}
exports.min = min;
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
function max(O) {
    return function (x, y) { return (O.compare(x, y) === -1 ? y : x); };
}
exports.max = max;
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
function clamp(O) {
    var minO = min(O);
    var maxO = max(O);
    return function (low, hi) { return function (x) { return maxO(minO(x, hi), low); }; };
}
exports.clamp = clamp;
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
function between(O) {
    var lessThanO = lt(O);
    var greaterThanO = gt(O);
    return function (low, hi) { return function (x) { return (lessThanO(x, low) || greaterThanO(x, hi) ? false : true); }; };
}
exports.between = between;
/**
 * @category constructors
 * @since 2.0.0
 */
function fromCompare(compare) {
    var optimizedCompare = function (x, y) { return (x === y ? 0 : compare(x, y)); };
    return {
        equals: function (x, y) { return optimizedCompare(x, y) === 0; },
        compare: optimizedCompare
    };
}
exports.fromCompare = fromCompare;
/**
 * Use `getMonoid` instead
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getSemigroup() {
    return {
        concat: function (x, y) { return fromCompare(function (a, b) { return Ordering_1.monoidOrdering.concat(x.compare(a, b), y.compare(a, b)); }); }
    };
}
exports.getSemigroup = getSemigroup;
/**
 * Returns a `Monoid` such that:
 *
 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
 * - its `empty` value is an `Ord` that always considers compared elements equal
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import { contramap, getDualOrd, getMonoid, ordBoolean, ordNumber, ordString } from 'fp-ts/Ord'
 * import { pipe } from 'fp-ts/function'
 * import { fold } from 'fp-ts/Monoid'
 *
 * interface User {
 *   id: number
 *   name: string
 *   age: number
 *   rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   ordString,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   ordNumber,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   ordBoolean,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const M = getMonoid<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = fold(M)([byName, byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = fold(M)([getDualOrd(byRememberMe), byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @category instances
 * @since 2.4.0
 */
function getMonoid() {
    return {
        // tslint:disable-next-line: deprecation
        concat: getSemigroup().concat,
        empty: fromCompare(function () { return 0; })
    };
}
exports.getMonoid = getMonoid;
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple
 *
 * @example
 * import { getTupleOrd, ordString, ordNumber, ordBoolean } from 'fp-ts/Ord'
 *
 * const O = getTupleOrd(ordString, ordNumber, ordBoolean)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @category instances
 * @since 2.0.0
 */
function getTupleOrd() {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    var len = ords.length;
    return fromCompare(function (x, y) {
        var i = 0;
        for (; i < len - 1; i++) {
            var r = ords[i].compare(x[i], y[i]);
            if (r !== 0) {
                return r;
            }
        }
        return ords[i].compare(x[i], y[i]);
    });
}
exports.getTupleOrd = getTupleOrd;
/**
 * @category combinators
 * @since 2.0.0
 */
function getDualOrd(O) {
    return fromCompare(function (x, y) { return O.compare(y, x); });
}
exports.getDualOrd = getDualOrd;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var contramap_ = function (fa, f) { return function_1.pipe(fa, exports.contramap(f)); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.0.0
 */
var contramap = function (f) { return function (fa) {
    return fromCompare(function (x, y) { return fa.compare(f(x), f(y)); });
}; };
exports.contramap = contramap;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Ord';
/**
 * @category instances
 * @since 2.0.0
 */
exports.ordDate = 
/*#__PURE__*/
function_1.pipe(exports.ordNumber, 
/*#__PURE__*/
exports.contramap(function (date) { return date.valueOf(); }));
/**
 * @category instances
 * @since 2.7.0
 */
exports.Contravariant = {
    URI: exports.URI,
    contramap: contramap_
};
// TODO: remove in v3
/**
 * @category instances
 * @since 2.0.0
 */
exports.ord = exports.Contravariant;

},{"./Ordering":"../node_modules/fp-ts/lib/Ordering.js","./function":"../node_modules/fp-ts/lib/function.js"}],"../node_modules/fp-ts/lib/Semigroup.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntercalateSemigroup = exports.semigroupVoid = exports.semigroupString = exports.semigroupProduct = exports.semigroupSum = exports.semigroupAny = exports.semigroupAll = exports.getObjectSemigroup = exports.getJoinSemigroup = exports.getMeetSemigroup = exports.getStructSemigroup = exports.getFunctionSemigroup = exports.getDualSemigroup = exports.getTupleSemigroup = exports.getLastSemigroup = exports.getFirstSemigroup = exports.fold = void 0;
/**
 * If a type `A` can form a `Semigroup` it has an **associative** binary operation.
 *
 * ```ts
 * interface Semigroup<A> {
 *   readonly concat: (x: A, y: A) => A
 * }
 * ```
 *
 * Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.
 *
 * ```ts
 * concat(x, concat(y, z)) = concat(concat(x, y), z)
 * ```
 *
 * A common example of a semigroup is the type `string` with the operation `+`.
 *
 * ```ts
 * import { Semigroup } from 'fp-ts/Semigroup'
 *
 * const semigroupString: Semigroup<string> = {
 *   concat: (x, y) => x + y
 * }
 *
 * const x = 'x'
 * const y = 'y'
 * const z = 'z'
 *
 * semigroupString.concat(x, y) // 'xy'
 *
 * semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'
 *
 * semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
 * ```
 *
 * *Adapted from https://typelevel.org/cats*
 *
 * @since 2.0.0
 */
var function_1 = require("./function");
var Ord_1 = require("./Ord");
function fold(S) {
    return function (startWith, as) {
        if (as === undefined) {
            var foldS_1 = fold(S);
            return function (as) { return foldS_1(startWith, as); };
        }
        return as.reduce(S.concat, startWith);
    };
}
exports.fold = fold;
/**
 * Always return the first argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.getFirstSemigroup<number>().concat(1, 2), 1)
 *
 * @category instances
 * @since 2.0.0
 */
function getFirstSemigroup() {
    return { concat: function_1.identity };
}
exports.getFirstSemigroup = getFirstSemigroup;
/**
 * Always return the last argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.getLastSemigroup<number>().concat(1, 2), 2)
 *
 * @category instances
 * @since 2.0.0
 */
function getLastSemigroup() {
    return { concat: function (_, y) { return y; } };
}
exports.getLastSemigroup = getLastSemigroup;
/**
 * Given a tuple of semigroups returns a semigroup for the tuple.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.getTupleSemigroup(S.semigroupString, S.semigroupSum)
 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const S2 = S.getTupleSemigroup(S.semigroupString, S.semigroupSum, S.semigroupAll)
 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @category instances
 * @since 2.0.0
 */
function getTupleSemigroup() {
    var semigroups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        semigroups[_i] = arguments[_i];
    }
    return {
        concat: function (x, y) { return semigroups.map(function (s, i) { return s.concat(x[i], y[i]); }); }
    };
}
exports.getTupleSemigroup = getTupleSemigroup;
/**
 * The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.getDualSemigroup(S.semigroupString).concat('a', 'b'), 'ba')
 *
 * @category instances
 * @since 2.0.0
 */
function getDualSemigroup(S) {
    return {
        concat: function (x, y) { return S.concat(y, x); }
    };
}
exports.getDualSemigroup = getDualSemigroup;
/**
 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
 *
 * @example
 * import { Predicate } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const S1 = S.getFunctionSemigroup(S.semigroupAll)<number>()
 *
 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
 *
 * const S2 = S.getFunctionSemigroup(S.semigroupAny)<number>()
 *
 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.0.0
 */
function getFunctionSemigroup(S) {
    return function () { return ({
        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    }); };
}
exports.getFunctionSemigroup = getFunctionSemigroup;
/**
 * Given a struct of semigroups returns a semigroup for the struct.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const semigroupPoint = S.getStructSemigroup<Point>({
 *   x: S.semigroupSum,
 *   y: S.semigroupSum
 * })
 *
 * assert.deepStrictEqual(semigroupPoint.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @category instances
 * @since 2.0.0
 */
function getStructSemigroup(semigroups) {
    return {
        concat: function (x, y) {
            var r = {};
            for (var _i = 0, _a = Object.keys(semigroups); _i < _a.length; _i++) {
                var key = _a[_i];
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
}
exports.getStructSemigroup = getStructSemigroup;
/**
 * Get a semigroup where `concat` will return the minimum, based on the provided order.
 *
 * @example
 * import * as O from 'fp-ts/Ord'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.getMeetSemigroup(O.ordNumber)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 1)
 *
 * @category instances
 * @since 2.0.0
 */
function getMeetSemigroup(O) {
    return {
        concat: Ord_1.min(O)
    };
}
exports.getMeetSemigroup = getMeetSemigroup;
/**
 * Get a semigroup where `concat` will return the maximum, based on the provided order.
 *
 * @example
 * import * as O from 'fp-ts/Ord'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.getJoinSemigroup(O.ordNumber)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 2)
 *
 * @category instances
 * @since 2.0.0
 */
function getJoinSemigroup(O) {
    return {
        concat: Ord_1.max(O)
    };
}
exports.getJoinSemigroup = getJoinSemigroup;
/**
 * Return a semigroup for objects, preserving their type.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const S1 = S.getObjectSemigroup<Person>()
 * assert.deepStrictEqual(S1.concat({ name: 'name', age: 23 }, { name: 'name', age: 24 }), { name: 'name', age: 24 })
 *
 * @category instances
 * @since 2.0.0
 */
function getObjectSemigroup() {
    return {
        concat: function (x, y) { return Object.assign({}, x, y); }
    };
}
exports.getObjectSemigroup = getObjectSemigroup;
/**
 * `boolean` semigroup under conjunction.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.semigroupAll.concat(true, true), true)
 * assert.deepStrictEqual(S.semigroupAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.0.0
 */
exports.semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * `boolean` semigroup under disjunction.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.semigroupAny.concat(true, true), true)
 * assert.deepStrictEqual(S.semigroupAny.concat(true, false), true)
 * assert.deepStrictEqual(S.semigroupAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.0.0
 */
exports.semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * `number` semigroup under addition.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.semigroupSum.concat(2, 3), 5)
 *
 * @category instances
 * @since 2.0.0
 */
exports.semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * `number` semigroup under multiplication.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.semigroupProduct.concat(2, 3), 6)
 *
 * @category instances
 * @since 2.0.0
 */
exports.semigroupProduct = {
    concat: function (x, y) { return x * y; }
};
/**
 * `string` semigroup under concatenation.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.semigroupString.concat('a', 'b'), 'ab')
 *
 * @category instances
 * @since 2.0.0
 */
exports.semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * @category instances
 * @since 2.0.0
 */
exports.semigroupVoid = {
    concat: function () { return undefined; }
};
/**
 * You can glue items between and stay associative.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.getIntercalateSemigroup(' ')(S.semigroupString)
 *
 * assert.strictEqual(S1.concat('a', 'b'), 'a b')
 * assert.strictEqual(S1.concat(S1.concat('a', 'b'), 'c'), S1.concat('a', S1.concat('b', 'c')))
 *
 * @category instances
 * @since 2.5.0
 */
function getIntercalateSemigroup(a) {
    return function (S) { return ({
        concat: function (x, y) { return S.concat(x, S.concat(a, y)); }
    }); };
}
exports.getIntercalateSemigroup = getIntercalateSemigroup;

},{"./function":"../node_modules/fp-ts/lib/function.js","./Ord":"../node_modules/fp-ts/lib/Ord.js"}],"voxel/raycasting.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performGazeRaycast = exports.createPerspectiveRayFromMouse = exports.createCameraRay = exports.raycastVoxels = exports.raycastVoxel = exports.raycastPlane = void 0;

var voxel_face_1 = require("./voxel-face");

var Option_1 = require("fp-ts/lib/Option");

var Semigroup_1 = require("fp-ts/lib/Semigroup");

var Ord_1 = require("fp-ts/lib/Ord");

var Vec3 = __importStar(require("../../lib/vec3"));

var mat3x3_1 = require("../../lib/mat3x3");

var raycastSemigroup = Semigroup_1.getMeetSemigroup(Ord_1.contramap(function (r) {
  return r.distance;
})(Ord_1.ordNumber)); //[alongAxis, alongPlane]

function decompose(v, axis) {
  var alongAxis = Vec3.project(axis, v);
  return [alongAxis, Vec3.subtract(v, alongAxis)];
}

function isPointOutsideVoxel(_a) {
  var x = _a[0],
      y = _a[1],
      z = _a[2];
  return x < -0.5 || x > +0.5 || y < -0.5 || y > +0.5 || z < -0.5 || z > +0.5;
}

function raycastPlane(localRay, planeOrigin, normal) {
  var origin = localRay.origin,
      vector = localRay.vector;
  var relOrigin = Vec3.subtract(origin, planeOrigin);
  var originCombination = decompose(relOrigin, normal);
  var vectorCombination = decompose(vector, normal);
  if (Vec3.dot(originCombination[0], vectorCombination[0]) >= 0) return Option_1.none;
  var planeStartPoint = Vec3.subtract(relOrigin, originCombination[0]);
  var intersectionScale = Vec3.magnitude(originCombination[0]) / Vec3.magnitude(vectorCombination[0]);
  var intersectionPoint = Vec3.add(planeOrigin, Vec3.add(planeStartPoint, Vec3.multiply(vectorCombination[1], intersectionScale)));
  return Option_1.some(intersectionPoint);
}

exports.raycastPlane = raycastPlane;

function raycastVoxelFace(localRayOrigin, rayVector, normal) {
  var faceOrigin = Vec3.multiply(normal, 0.5);
  var planeIntersectionOpt = raycastPlane({
    origin: localRayOrigin,
    vector: rayVector
  }, faceOrigin, normal);
  if (Option_1.isNone(planeIntersectionOpt)) return Option_1.none;
  var intersectionPoint = planeIntersectionOpt.value;
  if (isPointOutsideVoxel(intersectionPoint)) return Option_1.none;
  return planeIntersectionOpt;
}

function foldRaycastResults(results) {
  var filteredResults = results.filter(Option_1.isSome).map(function (r) {
    return r.value;
  });
  if (filteredResults.length === 0) return Option_1.none;
  return Option_1.some(Semigroup_1.fold(raycastSemigroup)(filteredResults[0], filteredResults.slice(1)));
}

function isSphereHit(ray, spherePosition, sphereRadius) {
  var rayOriginToSphere = Vec3.subtract(spherePosition, ray.origin);
  var rayComponent = Vec3.project(Vec3.normalize(ray.vector), rayOriginToSphere);
  var orthoDistSqrd = Vec3.sqrdMagnitude(rayOriginToSphere) - Vec3.sqrdMagnitude(rayComponent);
  return orthoDistSqrd < Math.pow(sphereRadius, 2);
}

exports.raycastVoxel = function (ray) {
  return function (voxel) {
    if (!isSphereHit(ray, [0, 0, 0], 1.75)) return Option_1.none;
    var localOrigin = Vec3.subtract(ray.origin, voxel);
    return foldRaycastResults(voxel_face_1.voxelFaceNormals.map(function (faceNormal) {
      var curResult = raycastVoxelFace(localOrigin, ray.vector, faceNormal);
      if (Option_1.isNone(curResult)) return Option_1.none;
      var localPoint = curResult.value;
      return Option_1.some({
        localPoint: localPoint,
        globalPoint: Vec3.add(voxel, localPoint),
        voxel: voxel,
        faceNormal: faceNormal,
        distance: Vec3.distance(localOrigin, localPoint)
      });
    }));
  };
};

function raycastVoxels(ray, voxels) {
  var allResults = voxels.map(exports.raycastVoxel(ray));
  var filteredResults = allResults.filter(Option_1.isSome).map(function (r) {
    return r.value;
  });
  if (filteredResults.length === 0) return Option_1.none;
  return Option_1.some(Semigroup_1.fold(raycastSemigroup)(filteredResults[0], filteredResults.slice(1)));
}

exports.raycastVoxels = raycastVoxels;

function createCameraRay(camera) {
  var transform = camera.transform;
  return {
    origin: transform.position,
    vector: transform.orientation.slice(6)
  };
}

exports.createCameraRay = createCameraRay;

function createPerspectiveRayFromMouse(mousePoint, camera) {
  var localVector = [mousePoint[0] - camera.settings.planeWidthHalf, camera.settings.planeHeightHalf - mousePoint[1], camera.settings.zScale];
  return {
    origin: camera.transform.position,
    vector: mat3x3_1.multiplyVector(camera.transform.orientation, localVector)
  };
}

exports.createPerspectiveRayFromMouse = createPerspectiveRayFromMouse;

function raycastGround(ray) {
  var planeIntersectionOpt = raycastPlane(ray, [0, -0.5, 0], [0, 1, 0]);
  if (Option_1.isNone(planeIntersectionOpt)) return Option_1.none;
  var isecPoint = planeIntersectionOpt.value;
  return Option_1.some({
    distance: Vec3.distance(ray.origin, isecPoint),
    faceNormal: [0, 1, 0],
    localPoint: isecPoint,
    globalPoint: isecPoint,
    voxel: [Math.round(isecPoint[0]), -1, Math.round(isecPoint[2])]
  });
} //raycast along the line of sight and find the face of a hit voxel or the ground


function performGazeRaycast(camera, voxels) {
  var ray = createCameraRay(camera);
  var voxelResult = raycastVoxels(ray, voxels);
  if (Option_1.isSome(voxelResult)) return voxelResult;
  return raycastGround(ray);
}

exports.performGazeRaycast = performGazeRaycast;
},{"./voxel-face":"voxel/voxel-face.ts","fp-ts/lib/Option":"../node_modules/fp-ts/lib/Option.js","fp-ts/lib/Semigroup":"../node_modules/fp-ts/lib/Semigroup.js","fp-ts/lib/Ord":"../node_modules/fp-ts/lib/Ord.js","../../lib/vec3":"../lib/vec3.ts","../../lib/mat3x3":"../lib/mat3x3.ts"}],"smooth-equation-casting.ts":[function(require,module,exports) {
"use strict";
/*
    description:
    cast a ray from the camera into the scene.
    if it intersects the "equation-box", there will be an intersection line.
    we have an equation which is represented by a function f from x, y, z to a number.
    f(x, y, z) => number
    we want to visualize the set of points where this function becomes zero.
    by the way, any equation involving x, y, z can be turned into a function like this.
    simply subtract one side from the other and voila.
    we want to find the closest point on the line that satisfies the equation, so is zero.
    each point on the intersection line corresponds to a number by this function.
    if 0 is the point where the line starts and 1 is where is ends, then we have a function graph.
    then we can simply search for the first zero on this graph (watch out for infinities!).
    if we find one, then the next step is to calculate a normal vector to the surface at that point.
    why is there even a surface? i have no proof but it feels like any equation that combines 3 numbers
    into a single number, reduces the degrees of freedom by 1 and thus leads to a surface.
    for the surface normal we need the derivatives of the function.
    there will be at most 3 derivatives (at most because the derivative does not exist necessarily),
    one for x, one for y and one for z.
    for very small deviations dx, dy, dz, the deviation in the function output is simply
    dx * px + dy * px + dz * pz
    where px, py, pz are the partial derivatives of f.
    we are interested in small vectors that keep the function zero.
    those vectors define the surface in the neighbourhood of our point.
    and ultimately we want to find a vector that is perpendicular to that surface
    dx * px + dy * px + dz * pz = 0.
    this is a dot product between vectors (dx, dy, dz) and (px, py, pz),
    therefore if (dx, dy, dz) satisfies the equation, it lies on the surface and is perpendicular to the
    vector (px, py, pz). therefore (px, py, pz) must be the surface normal.
    we then use the surface normal to compute the shading of the pixel and that's it.
*/

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raycastSurfaceNormal = exports.findFirstZero = exports.getIntersectionLine = void 0;

var Option_1 = require("fp-ts/lib/Option");

var raycasting_1 = require("./voxel/raycasting");

var Vec3 = __importStar(require("../lib/vec3"));

function getIntersectionLine(boxSize, ray) {
  var voxelSize = boxSize * 4 + 2;

  var scaledRay = __assign(__assign({}, ray), {
    origin: Vec3.multiply(ray.origin, 1 / voxelSize)
  });

  var isec1Opt = raycasting_1.raycastVoxel(scaledRay)([0, 0, 0]);
  if (Option_1.isNone(isec1Opt)) return Option_1.none;
  var isec1 = isec1Opt.value;
  var oppositeRay = {
    origin: Vec3.add(scaledRay.origin, Vec3.multiply(Vec3.normalize(scaledRay.vector), isec1.distance + Math.sqrt(3))),
    vector: Vec3.multiply(scaledRay.vector, -1)
  };
  var isec2Opt = raycasting_1.raycastVoxel(oppositeRay)([0, 0, 0]);
  if (Option_1.isNone(isec2Opt)) return Option_1.none;
  var isec2 = isec2Opt.value;
  return Option_1.some([Vec3.multiply(isec1.localPoint, voxelSize), Vec3.multiply(isec2.localPoint, voxelSize)]);
}

exports.getIntersectionLine = getIntersectionLine;

function sign(n) {
  return Math.sign(n);
} //in the range 0 to 1


function findFirstZero(func) {
  var dx = 0.05;
  var prevSign = Option_1.none;

  for (var x = 0; x <= 1; x += dx) {
    var curValOpt = func(x);
    if (Option_1.isNone(curValOpt)) continue;
    var curVal = curValOpt.value;
    var curSign = sign(curVal);
    if (curSign === 0) return Option_1.some(x);

    if (Option_1.isNone(prevSign)) {
      prevSign = Option_1.some(curSign);
      continue;
    }

    if (curSign !== prevSign.value) {
      var _a = prevSign.value === -1 ? [x - dx, x] : [x, x - dx],
          negX = _a[0],
          posX = _a[1];

      return findZeroByBisection(negX, posX, func);
    }
  }

  return Option_1.none;
}

exports.findFirstZero = findFirstZero;

function findZeroByBisection(negX, posX, func) {
  var mX = negX;

  for (var i = 0; i < 20; i++) {
    mX = (negX + posX) / 2;
    var mYOpt = func(mX);
    if (Option_1.isNone(mYOpt)) return Option_1.none;
    var mY = mYOpt.value;
    if (mY === 0) return Option_1.some(mX);
    if (mY > 0) posX = mX;else negX = mX;
  }

  return Option_1.some(mX);
}

function interpolateLine(line, t) {
  return Vec3.interpolate(line[0], line[1], t);
}

function createLineFunction(equationFunc, line) {
  return function (t) {
    return equationFunc(interpolateLine(line, t));
  };
}

exports.raycastSurfaceNormal = function (boxSize, equationFunc, equationDeriv) {
  return function (ray) {
    var lineOpt = getIntersectionLine(boxSize, ray);
    if (Option_1.isNone(lineOpt)) return Option_1.none;
    var lineFunc = createLineFunction(equationFunc, lineOpt.value);
    var firstZeroOpt = findFirstZero(lineFunc);
    if (Option_1.isNone(firstZeroOpt)) return Option_1.none;
    var intersectionPoint = interpolateLine(lineOpt.value, firstZeroOpt.value);
    var deriv = equationDeriv(intersectionPoint);
    if (Option_1.isNone(deriv[0]) || Option_1.isNone(deriv[1]) || Option_1.isNone(deriv[2])) return Option_1.none;
    var derivVector = [deriv[0].value, deriv[1].value, deriv[2].value];
    return Option_1.some(Vec3.normalize(Vec3.multiply(derivVector, +1)));
  };
};
},{"fp-ts/lib/Option":"../node_modules/fp-ts/lib/Option.js","./voxel/raycasting":"voxel/raycasting.ts","../lib/vec3":"../lib/vec3.ts"}],"camera/perspective-camera.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectPoints = exports.projectPoint = exports.createCamSettingsFromCanvas = void 0;

exports.createCamSettingsFromCanvas = function (zScale, planeScale, canvas) {
  return {
    zScale: zScale,
    planeWidthHalf: canvas.offsetWidth * planeScale / 2,
    planeHeightHalf: canvas.offsetHeight * planeScale / 2
  };
};

exports.projectPoint = function (cam) {
  return function (point) {
    var c = cam.zScale / point[2];
    return [c * point[0] / cam.planeWidthHalf, c * point[1] / cam.planeHeightHalf];
  };
};

exports.projectPoints = function (cam) {
  return function (points) {
    return points.map(exports.projectPoint(cam));
  };
};
},{}],"space-conversion.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.worldPointToScreenPoint = exports.worldPointToCamPoint = exports.camPointToScreenPoint = exports.viewportToCanvas = void 0;

var function_1 = require("fp-ts/lib/function");

var mat3x3_1 = require("../lib/mat3x3");

var Vec3 = __importStar(require("../lib/vec3"));

var perspective_camera_1 = require("./camera/perspective-camera");

exports.viewportToCanvas = function (ctx) {
  var canvas = ctx.canvas;
  return function (point) {
    return [point[0] * canvas.offsetWidth / 2, point[1] * canvas.offsetHeight / 2];
  };
};

exports.camPointToScreenPoint = function (ctx, camera) {
  return function (camPoint) {
    return exports.viewportToCanvas(ctx)(perspective_camera_1.projectPoint(camera.settings)(camPoint));
  };
};

exports.worldPointToCamPoint = function (camera) {
  return function (worldPoint) {
    return mat3x3_1.multiplyVector(camera.inverseMatrix, Vec3.subtract(worldPoint, camera.transform.position));
  };
};

exports.worldPointToScreenPoint = function (ctx, camera) {
  return function_1.flow(exports.worldPointToCamPoint(camera), exports.camPointToScreenPoint(ctx, camera));
};
},{"fp-ts/lib/function":"../node_modules/fp-ts/lib/function.js","../lib/mat3x3":"../lib/mat3x3.ts","../lib/vec3":"../lib/vec3.ts","./camera/perspective-camera":"camera/perspective-camera.ts"}],"util.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adjustCanvasSizeToWindow = exports.range = exports.startLoop = exports.removeEnclosedVoxels = exports.isVoxelEnclosed = exports.flattenY = exports.setYZero = exports.setY = exports.mapRange = exports.interpolate = exports.normalize = exports.createArray = exports.randomUnitVector = exports.scaleVector = exports.randomRange = exports.randomColor = exports.randomVector = void 0;

var function_1 = require("fp-ts/lib/function");

var Vec3 = __importStar(require("../lib/vec3"));

exports.randomVector = function (maxMag) {
  if (maxMag === void 0) {
    maxMag = 2;
  }

  return [0, 1, 2].map(function () {
    return (Math.random() - 0.5) * maxMag;
  });
};

exports.randomColor = function () {
  return "rgb(" + [0, 1, 2].map(function () {
    return Math.round(Math.random() * 255);
  }).join(",") + ")";
};

exports.randomRange = function (min, max) {
  return min + (max - min) + Math.random();
};

exports.scaleVector = function (scale) {
  return function (vec) {
    return [vec[0] * scale, vec[1] * scale];
  };
};

exports.randomUnitVector = function () {
  return Vec3.normalize([0, 1, 2].map(function () {
    return Math.random() - 0.5;
  }));
};

exports.createArray = function (length) {
  var arr = [];

  for (var i = 0; i < length; i++) {
    arr[i] = i;
  }

  return arr;
};

function normalize(from, to, value) {
  return (value - from) / (to - from);
}

exports.normalize = normalize;

function interpolate(from, to, value) {
  return from + (to - from) * value;
}

exports.interpolate = interpolate;

exports.mapRange = function (range1, range2, value) {
  var relVal = value - range1[0];
  var scale = (range2[1] - range2[0]) / (range1[1] - range1[0]);
  return range2[0] + relVal * scale;
};

exports.setY = function (y) {
  return function (v) {
    return [v[0], y, v[2]];
  };
};

exports.setYZero = exports.setY(0);
exports.flattenY = function_1.flow(exports.setYZero, Vec3.normalize);

var voxelExistsAt = function voxelExistsAt(voxels, point) {
  return voxels.some(function (v) {
    return Vec3.equal(v, point);
  });
};

var voxelExistsOrIsGroundAt = function voxelExistsOrIsGroundAt(voxels) {
  return function (point) {
    if (point[1] < 0) return true;
    return voxelExistsAt(voxels, point);
  };
};

var enclosingOffsets = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

exports.isVoxelEnclosed = function (voxels) {
  return function (voxel) {
    return enclosingOffsets.map(function (offset) {
      return Vec3.add(voxel, offset);
    }).every(voxelExistsOrIsGroundAt(voxels));
  };
};

function removeEnclosedVoxels(voxels) {
  return voxels.filter(function_1.not(exports.isVoxelEnclosed(voxels)));
}

exports.removeEnclosedVoxels = removeEnclosedVoxels;

exports.startLoop = function (onLoop) {
  var prevTime = 0;

  var loop = function loop() {
    var curTime = window.performance.now();
    var deltaTime = (curTime - prevTime) / 1000;
    prevTime = curTime;
    onLoop(deltaTime);
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};

function range(start, end) {
  var array = [];

  for (var i = start; i < end; i++) {
    array.push(i);
  }

  return array;
}

exports.range = range;

function adjustCanvasSizeToWindow(canvas) {
  var widthPx = window.innerWidth;
  var heightPx = window.innerHeight;
  var scalePx = window.devicePixelRatio || 1;
  Object.assign(canvas.style, {
    width: widthPx + "px",
    height: heightPx + "px"
  });
  Object.assign(canvas, {
    width: widthPx * scalePx,
    height: heightPx * scalePx
  });
}

exports.adjustCanvasSizeToWindow = adjustCanvasSizeToWindow;
},{"fp-ts/lib/function":"../node_modules/fp-ts/lib/function.js","../lib/vec3":"../lib/vec3.ts"}],"smooth-equation-casting-test.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Option_1 = require("fp-ts/lib/Option");

var ctx_util_1 = require("../lib/ctx-util");

var Vec3 = __importStar(require("../lib/vec3"));

var orbit_camera_1 = require("./camera/orbit-camera");

var smooth_equation_casting_1 = require("./smooth-equation-casting");

var space_conversion_1 = require("./space-conversion");

var util_1 = require("./util");

var raycasting_1 = require("./voxel/raycasting"); //setup canvas ###


function createCtx() {
  var canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    "position": "absolute"
  });
  document.body.appendChild(canvas);
  return canvas.getContext("2d");
}

function getCanvasSize(ctx) {
  var canvas = ctx.canvas;
  return [canvas.clientWidth, canvas.clientHeight];
}

var backgroundCtx = createCtx();
var ctx = createCtx();

var updateCanvasSize = function updateCanvasSize(ctx) {
  var canvas = ctx.canvas;
  var widthPx = window.innerWidth;
  var heightPx = window.innerHeight;
  var scalePx = window.devicePixelRatio || 1;
  Object.assign(canvas.style, {
    width: widthPx + "px",
    height: heightPx + "px"
  });
  Object.assign(canvas, {
    width: widthPx * scalePx,
    height: heightPx * scalePx
  });
  ctx.resetTransform();
  ctx.scale(scalePx, scalePx);
};

var onresize = function onresize() {
  updateCanvasSize(ctx);
  updateCanvasSize(backgroundCtx);
  var _a = [window.innerWidth, window.innerHeight],
      w = _a[0],
      h = _a[1];
  camera = __assign(__assign({}, camera), {
    settings: __assign(__assign({}, camera.settings), {
      planeWidthHalf: w / 2,
      planeHeightHalf: h / 2
    })
  });
  prepareAndRender();
};

window.onresize = onresize;

function renderCheckerboardPattern(ctx, cellSize) {
  var darkColor = "#262626";
  var lightColor = "#5c5c5c";

  var _a = getCanvasSize(ctx),
      w = _a[0],
      h = _a[1];

  var cellCountX = Math.ceil(w / cellSize);
  var cellCountY = Math.ceil(h / cellSize);
  var gridSize = [cellCountX * cellSize, cellCountY * cellSize];
  ctx.save();
  ctx.translate((w - gridSize[0]) / 2, (h - gridSize[1]) / 2);

  for (var x = 0; x < cellCountX; x++) {
    for (var y = 0; y < cellCountY; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? darkColor : lightColor;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  ctx.restore();
}

function orthoOrbitToPerspective(cam) {
  return __assign(__assign({}, orbit_camera_1.toRegularCamera(cam)), {
    settings: cam.settings
  });
}

var camera = {
  radius: 60,
  latitude: 0.52,
  longitude: -0.82,
  settings: {
    planeWidthHalf: window.innerWidth / 2,
    planeHeightHalf: window.innerHeight / 2,
    zScale: 2000
  }
};

function setupOrbitCameraControl() {
  var canvas = ctx.canvas;
  canvas.addEventListener("mousemove", function (e) {
    if (e.buttons !== 1) return;
    var s = 0.01;
    camera = __assign(__assign({}, camera), {
      longitude: camera.longitude + e.movementX * s,
      latitude: camera.latitude + e.movementY * s
    });
    prepareAndRender();
  });
  canvas.addEventListener("wheel", function (e) {
    camera = __assign(__assign({}, camera), {
      radius: camera.radius * (1 + e.deltaY * 0.001)
    });
    prepareAndRender();
  });
}

var backgroundColor = "#252729"; // "#d4d3d2";

var boxSize = 2;

function prepareAndRender() {
  renderCheckerboardPattern(backgroundCtx, 100);
  var canvas = ctx.canvas;
  var _a = [canvas.clientWidth, canvas.clientHeight],
      w = _a[0],
      h = _a[1];
  ctx.save(); // ctx.fillStyle = backgroundColor;
  // ctx.fillRect(0, 0, w, h);

  ctx.clearRect(0, 0, w, h);
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, -1);
  render();
  ctx.restore();
}

var unitBoxVerts = [[+1, +1, +1], [-1, +1, +1], [+1, -1, +1], [-1, -1, +1], [+1, +1, -1], [-1, +1, -1], [+1, -1, -1], [-1, -1, -1]];
var boxWireIndices = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
var boxIntersectionLine = Option_1.none;

function renderIntersectionLine(ctx, cam) {
  if (Option_1.isNone(boxIntersectionLine)) return;
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "orange";
  var screenPoints = boxIntersectionLine.value.map(space_conversion_1.worldPointToScreenPoint(ctx, cam));
  ctx_util_1.pathPolyline(ctx, screenPoints);
  ctx.stroke();
  ctx.restore();
}

var isOcclusionEdge = function isOcclusionEdge(worldToCam, cubeCenter) {
  return function (vert1, vert2) {
    var edgeCenter = Vec3.interpolate(vert1, vert2, 0.5);
    var occlusionCount = 0;

    for (var i = 0; i < 3; i++) {
      var val = edgeCenter[i];
      if (Math.abs(val) < 1e-5) continue;
      var faceCenterLocal = [0, 0, 0];
      faceCenterLocal[i] = val;
      var faceCenterGlobal = worldToCam(faceCenterLocal);
      var normalVector = Vec3.subtract(faceCenterGlobal, cubeCenter);

      if (Vec3.dot(normalVector, faceCenterGlobal) < 0) {
        occlusionCount++;
      }
    }

    return occlusionCount > 1;
  };
};

function renderWireBox(ctx, boxSize, cam) {
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fcba03";
  var boxSideLength = boxSize * 2 + 1;
  var boxVerts = unitBoxVerts.map(function (v) {
    return Vec3.multiply(v, boxSideLength);
  });
  var projectedBoxVerts = boxVerts.map(space_conversion_1.worldPointToScreenPoint(ctx, cam)); // const skipEdge = isOcclusionEdge(cam.transform.position);

  var skipEdge = isOcclusionEdge(space_conversion_1.worldPointToCamPoint(cam), space_conversion_1.worldPointToCamPoint(cam)([0, 0, 0]));

  for (var _i = 0, boxWireIndices_1 = boxWireIndices; _i < boxWireIndices_1.length; _i++) {
    var edgeInds = boxWireIndices_1[_i];
    var edgeVerts = edgeInds.map(function (i) {
      return projectedBoxVerts[i];
    });
    if (skipEdge(boxVerts[edgeInds[0]], boxVerts[edgeInds[1]])) continue;
    ctx_util_1.pathPolyline(ctx, edgeVerts);
    ctx.stroke();
  }

  ctx.restore();
}

var render = function render() {
  var perspectiveCam = orthoOrbitToPerspective(camera);
  renderIntersectionLine(ctx, perspectiveCam);
  renderWireBox(ctx, boxSize, perspectiveCam);
};

function graphFunction(x) {
  if (x === 0) return Option_1.none;
  return Option_1.some(Math.log(Math.sin(x)) + 1);
}

function renderZeroStuff() {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx_util_1.pathPolyline(ctx, [[-500, 0], [+500, 0]]);
  ctx.stroke();

  for (var x = 0; x < 1; x += 0.02) {
    var yOpt = graphFunction(x);
    if (Option_1.isNone(yOpt)) continue;
    var y = yOpt.value;
    var screenX = x * 200;
    var screenY = y * 200;
    ctx.fillStyle = "black";
    ctx_util_1.drawDisc(ctx, [screenX, screenY], 4);
  }

  var firstZeroOpt = smooth_equation_casting_1.findFirstZero(graphFunction);

  if (Option_1.isSome(firstZeroOpt)) {
    var x = firstZeroOpt.value;
    ctx.fillStyle = "red";
    ctx_util_1.drawDisc(ctx, [x * 200, 0], 4);
  }

  ctx.restore();
}

function nextFramePromise() {
  return new Promise(function (resolve) {
    return requestAnimationFrame(resolve);
  });
}

function renderBackgroundProgressStrip(stripWidth, height, ctx) {
  ctx.fillStyle = "teal";
  ctx.strokeStyle = "white";
  ctx.fillRect(0, 0, stripWidth, height);
  ctx.beginPath();
  ctx.moveTo(stripWidth, 0);
  ctx.lineTo(stripWidth, height);
  ctx.lineWidth = 2;
  ctx.stroke();
}

function fillPixelsByRaytracing(ctx, backgroundCtx, camera, raycastFunc) {
  return __awaiter(this, void 0, void 0, function () {
    var surfaceColor, lightDirection, _a, w, h, prevWorkStartTime, pixelSize, x, _loop_1, y;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          surfaceColor = [255, 255, 255];
          lightDirection = Vec3.normalize([0.3, -1, -0.2]);
          _a = getCanvasSize(ctx), w = _a[0], h = _a[1];
          prevWorkStartTime = window.performance.now();
          pixelSize = 1.5;
          x = 0;
          _b.label = 1;

        case 1:
          if (!(x < w)) return [3
          /*break*/
          , 6];
          renderBackgroundProgressStrip(x, h, backgroundCtx);

          _loop_1 = function _loop_1(y) {
            var workTimeDelta, screenPoint, ray, normalOpt, normal, brightness, adjustedColor;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  workTimeDelta = window.performance.now() - prevWorkStartTime;
                  if (!(workTimeDelta > 0.2)) return [3
                  /*break*/
                  , 2];
                  return [4
                  /*yield*/
                  , nextFramePromise()];

                case 1:
                  _a.sent();

                  _a.label = 2;

                case 2:
                  prevWorkStartTime = window.performance.now();
                  screenPoint = [x, y];
                  ray = raycasting_1.createPerspectiveRayFromMouse(screenPoint, camera);
                  normalOpt = raycastFunc(ray);
                  if (Option_1.isNone(normalOpt)) return [2
                  /*return*/
                  , "continue"];
                  normal = normalOpt.value;
                  brightness = util_1.interpolate(1, 0.3, Math.max(0, Vec3.dot(normal, lightDirection)));
                  adjustedColor = surfaceColor.map(function (c) {
                    return Math.round(c * brightness);
                  });
                  ctx.fillStyle = "rgb(" + adjustedColor.join(",") + ")";
                  ctx.fillRect(x, y, pixelSize, pixelSize);
                  return [2
                  /*return*/
                  ];
              }
            });
          };

          y = 0;
          _b.label = 2;

        case 2:
          if (!(y < h)) return [3
          /*break*/
          , 5];
          return [5
          /*yield**/
          , _loop_1(y)];

        case 3:
          _b.sent();

          _b.label = 4;

        case 4:
          y++;
          return [3
          /*break*/
          , 2];

        case 5:
          x++;
          return [3
          /*break*/
          , 1];

        case 6:
          return [2
          /*return*/
          ];
      }
    });
  });
}

var measureDerivatives = function measureDerivatives(func) {
  var d = 0.0001;
  return function (v) {
    var measuredDerivs = [Option_1.none, Option_1.none, Option_1.none];

    for (var i = 0; i < 3; i++) {
      var p = v.slice();
      p[i] += d;
      var _a = [func(v), func(p)],
          v1 = _a[0],
          v2 = _a[1];
      if (Option_1.isNone(v1) || Option_1.isNone(v2)) continue;
      var deriv = (v2.value - v1.value) / d;
      measuredDerivs[i] = Option_1.some(deriv);
    }

    return measuredDerivs;
  };
};

function makeSurfaceEquationAndDerivByScalarField(scalarField, scalarFieldDeriv) {
  var equationFunc = function equationFunc(_a) {
    var x = _a[0],
        y = _a[1],
        z = _a[2];
    var scalar = scalarField([x, z]);
    if (Option_1.isNone(scalar)) return Option_1.none;
    return Option_1.some(scalar.value - y);
  };

  var derivFunc = function derivFunc(_a) {
    var x = _a[0],
        y = _a[1],
        z = _a[2];
    var subDeriv = scalarFieldDeriv([x, z]);
    return [subDeriv[0], Option_1.some(-1), subDeriv[1]];
  };

  return {
    equationFunc: equationFunc,
    derivFunc: derivFunc
  };
}

var sin = Math.sin,
    cos = Math.cos;

var sineFuncs = function () {
  var _a = [2.5, 0.5],
      a = _a[0],
      f = _a[1];

  var func = function func(p) {
    var r = Math.hypot(p[0], p[2]);
    return Option_1.some(a * Math.cos(r * f) - p[1]);
  };

  var deriv = function deriv(p) {
    if (p[0] === 0 && p[2] === 0) {
      return [Option_1.some(0), Option_1.some(-1), Option_1.some(0)];
    }

    var rSqrd = Math.pow(p[0], 2) + Math.pow(p[2], 2);
    var r = Math.sqrt(rSqrd);
    var s1 = -a / rSqrd * Math.sin(r * f);
    return [Option_1.some(s1 * p[0]), Option_1.some(s1 * p[2]), Option_1.some(-1)];
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var inverseProdFuncs = function () {
  var _a = [2.5, 0.5],
      a = _a[0],
      f = _a[1];

  var func = function func(p) {
    return Option_1.some(p[0] * p[1] * p[2] - 2);
  };

  var deriv = function deriv(p) {
    var x = p[0],
        y = p[1],
        z = p[2];

    if (x === 0 || y === 0 || z === 0) {
      return [Option_1.none, Option_1.none, Option_1.none];
    }

    return [Option_1.some(y * z), Option_1.some(z * x), Option_1.some(x * y)];
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var sphereFuncs = function () {
  var rSqrd = 10;

  var func = function func(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return Option_1.some(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2) - rSqrd);
  };

  var deriv = function deriv(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return [Option_1.some(2 * x), Option_1.some(2 * y), Option_1.some(2 * z)];
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var metaBall = function () {
  var separation = 2;

  var func = function func(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    var y2 = Math.pow(y, 2);
    var z2 = Math.pow(z, 2);
    var dist1 = Math.pow(x + separation, 2) + y2 + z2;
    var dist2 = Math.pow(x - separation, 2) + y2 + z2;
    return Option_1.some(dist1 * dist2 - 18);
  };

  return {
    equationFunc: func,
    derivFunc: measureDerivatives(func)
  };
}();

var blobsFunc = function () {
  var c = 1.4;

  var func = function func(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return Option_1.some(sin(x) + sin(y) + sin(z) - c);
  };

  var deriv = function deriv(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return [Option_1.some(cos(x)), Option_1.some(cos(y)), Option_1.some(cos(z))];
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var testFunc1 = function () {
  var c = 1;

  var func = function func(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return Option_1.some(cos(Math.pow(x, 3)) + cos(Math.pow(y, 3)) + cos(Math.pow(z, 3)) - Vec3.magnitude(p));
  };

  var deriv = function deriv(p) {
    var r = Vec3.magnitude(p);
    return [0, 1, 2].map(function (i) {
      return Option_1.some(-3 * Math.pow(p[i], 2) * sin(Math.pow(p[i], 3)) - p[i] / r);
    });
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var hillFuncs = function () {
  var func = function func(p) {
    return Option_1.some(Math.pow(1 + Vec3.sqrdMagnitude(p), -2));
  };

  var deriv = function deriv(p) {
    var r = Vec3.magnitude(p);
    var t = -4 * Math.pow(1 + Vec3.sqrdMagnitude(p), -3);
    return [0, 1, 2].map(function (i) {
      return Option_1.some(t * p[i]);
    });
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var flatSurfaceFuncs = function () {
  var coeffs = [0, 1, 2].map(function (n) {
    return Math.random() - 0.5;
  });

  var func = function func(p) {
    return Option_1.some(coeffs[0] * p[0] + coeffs[1] * p[1] + coeffs[2] * p[2]);
  };

  var deriv = function deriv(p) {
    return coeffs.map(Option_1.some);
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var cylinderFuncs = function () {
  var rSqrd = 40;

  var func = function func(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return Option_1.some(Math.pow(x, 2) + Math.pow(z, 2) - rSqrd);
  };

  var deriv = function deriv(p) {
    return [Option_1.some(2 * p[0]), Option_1.some(0), Option_1.some(2 * p[2])];
  };

  return {
    equationFunc: func,
    derivFunc: deriv
  };
}();

var scalarFieldFuncs1 = function () {
  var a = 1;

  var field = function field(_a) {
    var x = _a[0],
        y = _a[1];
    return Option_1.some(a * Math.sin(x) * Math.sin(y));
  };

  var deriv = function deriv(_a) {
    var x = _a[0],
        y = _a[1];
    return [Option_1.some(a * Math.cos(x) * Math.sin(y)), Option_1.some(a * Math.sin(x) * Math.cos(y))];
  };

  return makeSurfaceEquationAndDerivByScalarField(field, deriv);
}();

var scalarFieldFuncs2 = function () {
  var a = -2;

  var field = function field(_a) {
    var x = _a[0],
        y = _a[1];
    return Option_1.some(a * Math.log(Math.hypot(x, y)) - 0.8);
  }; //log((x^2 + y^2)^0.5) -> x * (x^2 + y^2)^(-1)


  var deriv = function deriv(_a) {
    var x = _a[0],
        y = _a[1];
    var s = a / (Math.pow(x, 2) + Math.pow(y, 2));
    return [Option_1.some(x * s), Option_1.some(y * s)];
  };

  return makeSurfaceEquationAndDerivByScalarField(field, deriv);
}();

var selectedFuncs = metaBall;

window.setEquationFunc = function (untypedFunc) {
  if (typeof untypedFunc !== "function") {
    console.error("supplied argument is not a function!");
    return;
  }

  var safeFunc = function safeFunc(v) {
    var untypedOutput = untypedFunc(v);
    if (typeof untypedOutput !== "number") return Option_1.none;
    return Option_1.some(untypedOutput);
  };

  selectedFuncs = {
    equationFunc: safeFunc,
    derivFunc: measureDerivatives(safeFunc)
  };
  normalFunc = createNormalFunc();
};

function createNormalFunc() {
  var funcs = selectedFuncs;
  var normalFunc = smooth_equation_casting_1.raycastSurfaceNormal(boxSize, funcs.equationFunc, funcs.derivFunc);
  return normalFunc;
}

var normalFunc = createNormalFunc();
var raytracingActive = false;

function setupRaycastingControl() {
  document.addEventListener("keypress", function (e) {
    if (raytracingActive) return;
    if (e.key !== " ") return;
    prepareAndRender();
    raytracingActive = true;
    fillPixelsByRaytracing(ctx, backgroundCtx, orthoOrbitToPerspective(camera), normalFunc).then(function () {
      return raytracingActive = false;
    });
  });
  var canvas = ctx.canvas;
  canvas.addEventListener("mousemove", function (e) {
    if (!e.ctrlKey) return;
    var perspectiveCam = orthoOrbitToPerspective(camera);
    var mousePoint = [e.offsetX, e.offsetY];
    var ray = raycasting_1.createPerspectiveRayFromMouse(mousePoint, perspectiveCam);
    var normalOpt = normalFunc(ray);
    if (Option_1.isNone(normalOpt)) return;
    var normal = normalOpt.value;
    var surfaceColor = [255, 255, 255];
    var lightDirection = Vec3.normalize([0.3, -1, -0.2]);
    var brightness = util_1.interpolate(1, 0.3, Math.max(0, Vec3.dot(normal, lightDirection)));
    var adjustedColor = surfaceColor.map(function (c) {
      return Math.round(c * brightness);
    });
    ctx.fillStyle = "rgb(" + adjustedColor.join(",") + ")";
    ctx.fillRect(mousePoint[0], mousePoint[1], 1, 1);
  });
}

function addInstructions() {
  document.body.insertAdjacentHTML("beforeend", "\n\t\t\t<div \n\t\t\t\tid=\"instructions\" \n\t\t\t\tstyle=\"\n\t\t\t\t\tposition: absolute; \n\t\t\t\t\ttop: 0px; left: 0px; right: 0px; \n\t\t\t\t\tcolor: #e7e7e7; font-size: 24px;\n\t\t\t\t\ttext-align: center;\n\t\t\t\t\"\n\t\t\t>\n\t\t\t\t<p>\n\t\t\t\t\tyou can supply your own equation in the developer console!\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\tpress space to start rendering\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t"); //remove instructions when space is pressed

  document.addEventListener("keydown", function (e) {
    if (e.key === " ") {
      var instructionsDiv = document.querySelector("#instructions");
      if (!instructionsDiv) return;
      instructionsDiv.remove();
    }
  });
}

function addConsoleInstructions() {
  console.log("here is an example how to write a function.\nlet's say you want to plot the equation x * x = y - z\nsimply subtract the right side from the left and write x * x - (y - z).\nthen call this global function:\nsetEquationFunc([x, y, z] => x * x - y + z);\n\t");
}

var main = function main() {
  addInstructions();
  addConsoleInstructions();
  updateCanvasSize(ctx);
  updateCanvasSize(backgroundCtx);
  onresize();
  setupOrbitCameraControl();
  setupRaycastingControl();
  prepareAndRender();
};

main();
},{"fp-ts/lib/Option":"../node_modules/fp-ts/lib/Option.js","../lib/ctx-util":"../lib/ctx-util.ts","../lib/vec3":"../lib/vec3.ts","./camera/orbit-camera":"camera/orbit-camera.ts","./smooth-equation-casting":"smooth-equation-casting.ts","./space-conversion":"space-conversion.ts","./util":"util.ts","./voxel/raycasting":"voxel/raycasting.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./smooth-equation-casting-test");
},{"./smooth-equation-casting-test":"smooth-equation-casting-test.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57107" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map