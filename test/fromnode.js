let Mocha = require('mocha'),
    path = require('path')

// Instantiate a Mocha instance.
let mocha = new Mocha({
    ui: 'tdd',
    reporter: 'list'
})

mocha.addFile(
    path.join(__dirname, 'test.js')
)

// Run the tests.
mocha.run(failures => {
    process.on('exit', () => {
        process.exit(failures)  // exit with non-zero status if there were failures
    })
})
