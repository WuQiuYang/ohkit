/**
 * @file prefix-classname
 * @description add prefix for classname basic of classnames
 * @author <wuqiuyang305@126.com>
*/
import classNames from 'classnames';

export {classNames};

/**
 * add prefix for classname basic of classnames
 * @param prefix: classname 的前缀
 * @returns classname string
 */
export function prefixClassname(prefix = '') {
    return function(...arg: classNames.ArgumentArray) {
        return classNames(...arg).split(' ').map(c => prefix + c).join(' ');
    }
}

/**
 * 自实现 classnames 版
 */
// export function prefixClassname(prefix = '') {
//     return function (...arg: classNames.ArgumentArray) {
//         function walk(clsList: typeof arg) {
//             const newClsList: string[] = [];
//             clsList.forEach(cls => {
//                 if (!cls) {
//                     return;
//                 }
//                 if (typeof cls === 'string') {
//                     newClsList.push(prefix + cls);
//                 } else if (typeof cls === 'object' && !('at' in cls)) {
//                     for (const k in cls) {
//                         if (cls[k]) {
//                             newClsList.push(prefix + k);
//                         };
//                     }
//                 } else if (Array.isArray(cls)) {
//                     newClsList.push(...walk(cls));
//                 } 
//             })
//             return newClsList;
//         }
//         return walk(arg).join(' ');
//     }
// }

export default prefixClassname;