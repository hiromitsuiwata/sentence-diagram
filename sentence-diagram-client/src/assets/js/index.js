import _ from 'lodash';
import '../css/brands.css';
import '../css/fontawesome.css';
import '../css/sentence.css';
import '../css/solid.css';


function component() {
  let element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());