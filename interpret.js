let program = [

  { print: 'hello' },
  { print: 'world' }

]

let builtins = {
  print: (text) => { console.log(text) }
}

interpret = (program) => {
  for (let stmt of program) {
    exec(stmt)
  }
};

exec = (stmt) => {
  let key = Object.keys(stmt)[0]
  if (typeof builtins[key] === 'function') {
    builtins[key](stmt[key])
  }else{
    console.error('unknown instruction: '+key)
  }
}

interpret(program)
