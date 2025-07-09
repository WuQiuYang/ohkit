export const text =
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom\n" +
  "测试文本也可以是reactDom测试文本也可以是reactDom测试文本也可以是reactDom";

export const codeDemo = `<Measure client>
  {({ measureRef, contentRect }) => {
    return (
      <div ref={measureRef} style={{ backgroundColor: "antiquewhite" }}>
        width: {contentRect.client?.width} - height: {contentRect.client?.height}
      </div>
    );
  }}
</Measure>
`;
