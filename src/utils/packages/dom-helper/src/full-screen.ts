interface IFullscreenOptions {
  /**
   * 全屏的目标元素
   * @default document.body
   */
  element?: Element | null;
  /**
   * 全屏时，目标元素添加的类名
   */
  className?: string;
  /**
   * 全屏时回调
   */
  onEnter?: () => void;
  /**
   * 退出全屏时回调
   */
  onExit?: () => void;
}

export interface ILaunchFullscreenOptions extends IFullscreenOptions {
  /**
   * 是否仅是网页全屏
   * @default false
   */
  onlyFullPage?: boolean;
}

export const CompatiblePrefixList = ["webkit", "moz", "ms"];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextTick(fun: () => void) {
  return setTimeout(fun, 0);
}

const IsSafari =
  typeof navigator !== "undefined" &&
  /Version\/[\d\.]+.*Safari/.test(navigator.userAgent);

/**
 * 获取兼容性API方法
 * @template S 元素类型，可以是Element或Document
 * @template T API名称类型，是S类型的key
 * @param {S} ele 目标元素
 * @param {T} apiName 要获取的API名称
 * @param {string[]} [prefixes=CompatiblePrefixList] 浏览器前缀列表，默认为CompatiblePrefixList
 * @returns 返回兼容性处理后的API方法
 */
export const getCompatibleApi = <
  S extends Element | Document,
  T extends keyof S
>(
  ele: S,
  apiName: T,
  prefixes = CompatiblePrefixList
) => {
  if (typeof apiName === "symbol" || typeof apiName === "number") {
    return ele[apiName];
  }
  return prefixes.reduce((result, prefix) => {
    if (typeof result !== "undefined") {
      return result;
    }
    return ele[
      prefix
        ? (`${prefix}${
            apiName.substring(0, 1).toUpperCase() + apiName.substring(1)
          }` as typeof apiName)
        : apiName
    ];
  }, ele[apiName]);
};

export class Fullscreen {
  private static initFullscreenListeners = false;
  private static uuid = 0;
  private static fullPageElem: Element | null = null;
  private static prefullscreenElem: Element | null = null;

  private static events: {
    exit: Map<Element, Array<() => void>>;
    // 可拓展
  } = {
    exit: new Map(),
  };

  constructor(opt?: { fullElemStyles?: string }) {
    const { fullElemStyles = "" } = opt || {};
    if (fullElemStyles) {
      this.fullElemStyles += fullElemStyles;
    }
    this.setupFullscreenListeners();
  }

  private uniKey = `fullscreen-${(this.constructor as typeof Fullscreen)
    .uuid++}`;

  private fullElemStyles = `
        position: fixed !important;
        inset: 0px !important;
        margin: 0px !important;
        object-fit: contain;
        transform: none !important;
        z-index: 1000000 !important;
        box-sizing: border-box !important;
        width: auto !important;
        height: auto !important;
        min-width: 0px !important;
        min-height: 0px !important;
        max-width: unset !important;
        max-height: unset !important;
    `;
  private originalFullElemStyles = "";

  /**
   * 启动网页全屏
   * @description（注意父级元素设置了影响布局的样式，比如transform等会导致全屏失效）
   * @param elem 网页全屏的元素。
   */
  launchFullPage = (
    eleOrOpt?: Element | IFullscreenOptions,
    opts: Omit<IFullscreenOptions, "element"> = {}
  ) => {
    try {
      let elem: Element = document.body;
      if (eleOrOpt instanceof Element) {
        elem = eleOrOpt;
      } else {
        elem = eleOrOpt?.element || document.body;
        opts = eleOrOpt || {};
      }
      const { className, onEnter, onExit } = opts;
      if (elem instanceof HTMLElement) {
        this.originalFullElemStyles = elem.style.cssText;
        // 覆盖
        elem.style.cssText = this.originalFullElemStyles + this.fullElemStyles;
        if (className) {
          elem.classList.add(className);
          this.addEvent(elem, () => {
            elem.classList.remove(className);
          });
        }
        const cotr = this.constructor as typeof Fullscreen;
        cotr.fullPageElem = elem;
        this.addEvent(elem, () => {
          cotr.fullPageElem = null;
        });
        if (onEnter) {
          nextTick(() => {
            onEnter();
          });
        }
        if (onExit) {
          this.addEvent(elem, () => {
            onExit();
          });
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * 退出网页全屏
   */
  exitFullPage = (elem: Element | null) => {
    // className不能有空格, 误传新版chrome会报错, catch一下
    try {
      const cotr = this.constructor as typeof Fullscreen;
      if (elem instanceof HTMLElement) {
        elem.style.cssText = this.originalFullElemStyles;
        this.flushAndDispose(elem);
      }
      cotr.fullPageElem = null;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  fullscreenEnabled = () => {
    return getCompatibleApi(document, "fullscreenEnabled");
  };
  getFullscreenElement = () => {
    return getCompatibleApi(document, "fullscreenElement");
  };

  /**
   * 启动浏览器全屏
   */
  launchFullscreen = async (
    eleOrOpt?: Element | ILaunchFullscreenOptions,
    opts: Omit<ILaunchFullscreenOptions, "element"> = {}
  ) => {
    try {
      let element: Element = document.body;
      if (eleOrOpt instanceof Element) {
        element = eleOrOpt;
      } else {
        element = eleOrOpt?.element || document.body;
        opts = eleOrOpt || {};
      }
      const {
        // element = document.body,
        onlyFullPage: isFullPage = false,
        className = "",
        onEnter,
        onExit,
      } = opts || {};
      const cotr = this.constructor as typeof Fullscreen;
      const rootElement = element || document.body;
      const curFullscreenElement = this.getFullscreenElement();

      if (
        (!isFullPage && rootElement === curFullscreenElement) ||
        (isFullPage && rootElement === cotr.fullPageElem)
      ) {
        return false;
      }

      // chrome 支持多层全屏，但safari不支持，需要先退出当前全屏，再启下一个全屏
      if (!isFullPage && IsSafari && curFullscreenElement) {
        await this.exitFullscreen();
        // TODO: safari 浏览器全屏退出后，需要延迟一下，否则会黑屏？！
        await sleep(300);
      }

      // 网页全屏
      const fullElem = () => {
        this.launchFullPage(rootElement, { className, onEnter, onExit });
      };

      if (isFullPage) {
        this.exitFullPage(cotr.fullPageElem);
        // 浏览器全屏 切换至 网页全屏 时 nexttick确保先退出全屏再进行网页全屏
        nextTick(() => {
          fullElem();
        });
        return true;
      }

      if (this.fullscreenEnabled()) {
        if (onExit) {
          this.addEvent(rootElement, onExit);
        }
        return getCompatibleApi(rootElement, "requestFullscreen")
          ?.call(rootElement)
          .then(() => {
            if (className) {
              rootElement.classList.add(className);
              this.addEvent(rootElement, () => {
                rootElement.classList.remove(className);
              });
            }
            onEnter?.();
            return true;
          })
          .catch((err) => {
            console.error(err);
            return false;
          });
      } else {
        console.log("[Fullscreen]: 当前浏览器不支持全屏，降级处理为网页全屏");
        fullElem();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  /**
   * 退出浏览器全屏
   */
  exitFullscreen = async () => {
    try {
      const cotr = this.constructor as typeof Fullscreen;
      const fullScreenElement = this.getFullscreenElement();
      if (!fullScreenElement) {
        // 退出网页全屏
        if (cotr.fullPageElem) {
          this.exitFullPage(cotr.fullPageElem);
          return true;
        }
        return false;
      }

      if (getCompatibleApi(document, "exitFullscreen")) {
        return getCompatibleApi(document, "exitFullscreen")
          ?.call(document)
          .then(() => {
            this.flushAndDispose(fullScreenElement);
            return true;
          })
          .catch((err) => {
            console.error(err);
            return false;
          });
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  private addEvent = (
    elem: Element,
    handler: () => void
    // type: keyof (typeof Fullscreen)["events"] = "exit",
  ) => {
    const cotr = this.constructor as typeof Fullscreen;
    const arr = cotr.events.exit.get(elem) || [];
    arr.push(handler);
    cotr.events.exit.set(elem, arr);
  };

  private flushAndDispose = (
    elem?: Element
    // types: Array<keyof (typeof Fullscreen)["events"]> = ["exit"]
  ) => {
    const cotr = this.constructor as typeof Fullscreen;
    if (elem) {
      //   types.forEach((type) => {
      // });
      cotr.events.exit.get(elem)?.forEach((handler) => handler());
      cotr.events.exit.delete(elem);
    } else {
      // 兼容低版本浏览器
      const mapToArr = Array.from(cotr.events.exit);
      for (const [key, value] of mapToArr) {
        value.forEach((handler) => handler());
        cotr.events.exit.delete(key);
      }
    }
  };

  private setupFullscreenListeners = () => {
    try {
      const cotr = this.constructor as typeof Fullscreen;
      if (cotr.initFullscreenListeners) {
        return;
      }
      cotr.initFullscreenListeners = true;
      const events = [""]
        .concat(CompatiblePrefixList)
        .map((prefix) => prefix + "fullscreenchange");
      const handleFullscreenChange = (evt: Event) => {
        const fullScreenElement = this.getFullscreenElement();
        if (fullScreenElement) {
          console.log(
            "[Fullscreen]: 进入全屏模式",
            this.uniKey,
            evt
            // cotr.prefullscreenElem,
            // " => ",
            // fullScreenElement
          );
          cotr.prefullscreenElem = fullScreenElement;
        } else {
          console.log(
            "[Fullscreen]: 退出全屏模式",
            this.uniKey,
            evt
            // constructor.events.exit
          );
          this.exitFullPage(cotr.fullPageElem);
          this.flushAndDispose();
        }
      };
      events.forEach((event) => {
        document.addEventListener(event, handleFullscreenChange);
      });
    } catch (e) {
      console.error(e);
    }
  };
}

/**
 * 实例化一个单例的全屏对象
 */
export const singleFullscreen = new Fullscreen();
export const {
  launchFullscreen,
  exitFullscreen,
  launchFullPage,
  exitFullPage,
} = singleFullscreen;
