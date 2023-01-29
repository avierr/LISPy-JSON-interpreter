let program = [
  { 
    print: { '+': [3,5] } 
  },
]

let builtins = {
  print: (text) => { console.log(text) }
}

let binaryOperators = {
  '+': (a,b) => { return a+b },
}

interpret = (program) => {
  for (let stmt of program) {
    exec(stmt)
  }
};

exec = (stmt) => {

  if(typeof stmt === 'number' || typeof stmt === 'string'){
    return stmt;
  }

  let key = Object.keys(stmt)[0]
  if (typeof builtins[key] === 'function') {
    builtins[key](exec(stmt[key]))
  } else if (typeof binaryOperators[key] === 'function') {
    let firstArgument = stmt[key][0];
    let secondArgument = stmt[key][1];
    return binaryOperators[key](firstArgument, secondArgument)
  }else{
    console.error('unknown instruction: '+key)
  }
}

interpret(program)