export function AutoUnsubscribe(target: string) {

    return (constructor) => {
      const original = constructor.prototype.ngOnDestroy;
  
      constructor.prototype.ngOnDestroy = function () {
        this[target].forEach(i => i.unsubscribe());
        if (original && typeof original === 'function') {
          original.apply(this, arguments);
        }
      };
    }
  }