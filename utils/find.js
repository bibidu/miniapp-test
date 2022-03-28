function throwErrorWhenTimeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("timeout");
    }, ms);
  });
}

async function createTimeoutPromise(promise, time, errorText = "超时") {
  try {
    const result = await Promise.race([promise, throwErrorWhenTimeout(10000)]);
    return [null, result];
  } catch (error) {
    return [error];
  }
}

module.exports.find = async (page, selector) => {
  const selectors = selector.split(" ");
  const waitForAllSelctors = (() => {
    try {
      return Promise.all(selectors.map((selector) => page.waitFor(selector)));
    } catch (error) {
      console.log("waitForAllSelctors error", error);
    }
  })();
  const [error] = await createTimeoutPromise(waitForAllSelctors);
  if (error) {
    console.log("[find] error", error);
    return null;
  }

  return selectors.reduce(
    (promise, selector) =>
      promise.then((parent) => (parent ? parent.$(selector) : null)),
    Promise.resolve(page)
  );
};
