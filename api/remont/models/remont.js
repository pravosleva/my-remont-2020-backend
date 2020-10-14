'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

function debounce(f, ms) {
  let timer = null;

  return function (...args) {
    const onComplete = () => {
      f.apply(this, args);
      timer = null;
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(onComplete, ms);
  };
}

const debouncedAfterUpdate = debounce(({ result, params, data }) => {
  // console.log("=== debounced socket.emit for afterUpdate webhook");
  // strapi.io.emit("ARTICLE_UPDATED", {
  //   id: model._conditions ? model._conditions._id : null,
  // });
  strapi.io.emit("REMONT_UPDATED", { result, params, data })
}, 500);

module.exports = {
  /**
   * Triggered before user creation.
   */
  lifecycles: {
    async afterUpdate(result, params, data) {
      // SAMPLE:
      // const passwordHashed = await strapi.api.user.services.user.hashPassword(data.password);
      // data.password = passwordHashed;

      debouncedAfterUpdate({ result, params, data });
    },
  },
};
