// reads the css file in dist folder, and creates a <style> tag and appends it to the head of the document.

export const generateCSS = () => {
  const css = `/* src/web-studio.scss */
body.agility-live-preview {
  scrollbar-width: thin;
  scrollbar-color: "aaa";
}
body.agility-live-preview::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
body.agility-live-preview::-webkit-scrollbar-track {
  background: rgba(221, 221, 221, 0);
  border-radius: 20px;
}
body.agility-live-preview::-webkit-scrollbar-track:hover {
  background: rgba(221, 221, 221, 0.3333333333);
}
body.agility-live-preview::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: rgba(170, 170, 170, 0.6666666667);
}
body.agility-live-preview::-webkit-scrollbar-thumb:hover {
  background: rgba(170, 170, 170, 0.6);
}
body.agility-live-preview .agility-component {
  position: relative;
  transition: all 0.2s ease-in-out;
  border: 2px dashed rgba(156, 163, 175, 0);
}
body.agility-live-preview .agility-component:hover {
  border: 2px dashed #9ca3af;
}
body.agility-live-preview .agility-component:hover .agility-component-edit {
  background: #9ca3af;
  opacity: 1;
}
body.agility-live-preview .agility-component:hover .agility-field {
  border: 1px dotted rgba(156, 163, 175, 0.6666666667);
}
body.agility-live-preview .agility-component .agility-component-edit {
  transition: all 0.2s ease-in-out;
  position: absolute;
  background: rgba(156, 163, 175, 0.6666666667);
  border-radius: 0 0 0 4px;
  color: white;
  padding: 5px 10px;
  top: 0px;
  right: 0px;
  height: 30px;
  width: 40px;
  text-align: center;
  opacity: 0;
}
body.agility-live-preview .agility-component .agility-component-edit:hover {
  background: #691ad8;
}
body.agility-live-preview .agility-component .agility-component-edit img {
  margin: 0;
}
body.agility-live-preview .agility-component .agility-field {
  position: relative;
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(105, 26, 216, 0);
}
body.agility-live-preview .agility-component .agility-field:hover {
  border: 1px solid #691ad8;
}
body.agility-live-preview .agility-component .agility-field:hover .agility-field-edit {
  opacity: 1;
}
body.agility-live-preview .agility-component .agility-field .agility-field-edit {
  transition: all 0.2s ease-in-out;
  position: absolute;
  background: rgba(156, 163, 175, 0.6666666667);
  border-radius: 0 0 0 4px;
  color: white;
  padding: 5px 10px;
  top: 0px;
  right: 0px;
  height: 30px;
  width: 40px;
  text-align: center;
  opacity: 0;
}
body.agility-live-preview .agility-component .agility-field .agility-field-edit:hover {
  background: #691ad8;
}
body.agility-live-preview .agility-component .agility-field .agility-field-edit img {
  margin: 0;
}
/*# sourceMappingURL=web-studio.css.map */
`
  const style = document.createElement("style")
  style.textContent = css
  document.head.appendChild(style)
}
