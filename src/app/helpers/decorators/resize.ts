export function Optimization(delay: number) {
   return function(target: any, className: any, descriptor: PropertyDescriptor) {
      const onWindowResizeInstance = descriptor.value;
      let resizeTimeout: any = null;
      let postFeedInstance: any;

      descriptor.value = function() {
         postFeedInstance = this;

         if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
               onWindowResizeInstance.apply(postFeedInstance);
               resizeTimeout = null;
            }, delay);
         }
      };
   };
}
