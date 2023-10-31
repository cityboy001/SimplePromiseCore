const PENDING = "pending";
const REJECTED = "rejected";
const RESOLVED = "resolved";

// 只有then核心链式调用代码，无其他比如异常处理等代码  只是为了解其核心实现
class MyPromise {
  status = PENDING;
  data = null;
  onResolvedCallbacks = [];
  onRejectedCallbacks = [];
  constructor(func) {
    const resolve = (data) => {
      this.data = data;
      try {
        this.onResolvedCallbacks.forEach((callBack) => {
          callBack(this.data);
        });

        this.status = RESOLVED;
      } catch (e) {
        this.onRejectedCallbacks.forEach((callBack) => {
          callBack();
        });
        this.status = REJECTED;
      }
    };
    const reject = (err) => {
      this.status = REJECTED;
      this.error = err;
      this.onRejectedCallbacks.forEach((callBack) => {
        callBack();
      });
    };

    func(resolve, reject);
  }

  then(onResolved, onRejected) {
    onResolved =
      typeof onResolved === "function"
        ? onResolved
        : function (v) {
            return e;
          };
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : function (e) {
            throw e;
          };
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          const result = onResolved(this.data);
          this.resolvePromise2(promise2, result, resolve, reject);
        });
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          const result = onRejected(this.data);
          this.resolvePromise2(promise2, result, resolve, reject);
        });
      } else {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            const result = onResolved(this.data);
            this.resolvePromise2(promise2, result, resolve, reject);
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            const result = onRejected(this.data);
            this.resolvePromise2(promise2, result, resolve, reject);
          });
        });
      }
    });
    return promise2;
  }

  resolvePromise2(promise2, result, resolve, reject) {
    if (result === promise2) {
      return reject(new TypeError("Chaining cycle detected for promise!"));
    }
    if (result instanceof MyPromise) {
      if (result.status === PENDING) {
        result.then((value) => {
          this.resolvePromise2(promise2, value, resolve, reject);
        });
      } else {
        result.then(resolve, reject);
      }
      return;
    } else {
      resolve(result);
    }
  }
}
