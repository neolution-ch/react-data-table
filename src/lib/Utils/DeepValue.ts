export function getDeepValue(object: any, name: string): any {
  if (name.indexOf(".") > 0) {
    let firstName = name.substr(0, name.indexOf("."));
    let secondName = name.substr(name.indexOf(".") + 1);

    if (firstName.endsWith("]")) {
      secondName = `${firstName.substr(firstName.indexOf("[") + 1).replace("]", "")}.${secondName}`;
      firstName = firstName.substr(0, firstName.indexOf("["));
    }

    if (object[firstName] === undefined) {
      console.log(`no deep value of '${firstName}' possible '${JSON.stringify(object)}'`);
      return undefined;
    }

    return getDeepValue(object[firstName], secondName);
  }

  return object[name];
}

export function setDeepValue(object: any, name: string, value: any) {
  if (name.indexOf(".") > 0) {
    let firstName = name.substr(0, name.indexOf("."));
    let secondName = name.substr(name.indexOf(".") + 1);

    if (firstName.endsWith("]")) {
      secondName = `${firstName.substr(firstName.indexOf("[") + 1).replace("]", "")}.${secondName}`;
      firstName = firstName.substr(0, firstName.indexOf("["));
    }

    setDeepValue(object[firstName], secondName, value);
  } else {
    // eslint-disable-next-line no-param-reassign
    object[name] = value;
  }
}
