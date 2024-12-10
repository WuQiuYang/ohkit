/**
 * @description: 测试数据
 */

export const text =
  "改变文本容器宽度看看效果\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom";

export const element = (
  <article>
    <aside>一篇富文本文章 导航</aside>
    <h1>大标题</h1>
    <p>{text}</p>
    <div>
      <img width="160" src="//www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" />
    </div>
    <div>
      <table>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
          </tr>
          <tr>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3>三级标题</h3>
    <ul>
      <li>12 <a href="https://www.baidu.com">baidu</a></li>
      <li>34</li>
      <li>56</li>
      <li>78</li>
    </ul>
  </article>
);
