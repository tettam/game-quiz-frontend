export function messageError(item, typeMsg) {
  const myClassStyle = typeMsg ? 'show--msg-sucess' : 'show--msg-error';
  
  item.classList.add(myClassStyle);

  setTimeout(() => {
    item.classList.remove(myClassStyle);
  }, 5000);
};
