const readline = require("readline")

class Editor {
    constructor(screenRows, screenCols) {
        this.screenRows = screenRows
        this.screenCols = screenCols
        this.cursor = {x: 0, y: 0}
        this.rows = []
        this.currentRow = ""
    }

    refreshScreen() {
        let buffer = [
            "\x1b[?25l",  // disable cursor
            "\x1b[H",     // move cursor back to (0, 0)
        ]

        for(let i = 0; i < this.screenRows; i++) {
            buffer.push("\x1b[K")  // clean the current line

            // rows
            if(i < this.rows.length) {
                buffer.push(this.rows[i].text)
                buffer.push("\r\n")
                continue
            }

            // current row
            if(i == this.rows.length) {
                buffer.push(this.currentRow.text)
                buffer.push("\r\n")
                continue
            }

            // regular lines
            if(i < this.screenRows - 1) {
                buffer.push("~\r\n")
                continue
            }

            // last line
            buffer.push(`y: ${this.cursor.y + 1}, x: ${this.cursor.x} + 1`)

            // if(i == Math.floor(this.screenRows / 3)) {
            //     let welcomeMessage = "Kilo editor -- version 1.0"
            //     let padding = Math.floor((this.screenCols - welcomeMessage.length) / 2)
            //     if(padding) {
            //         buffer.push("~")
            //         padding--;
            //     }
            //     while(padding--) { buffer.push(" ")}
            //     buffer.push(welcomeMessage)
            //     buffer.push("\n")
            // }

        }

        // move the cursor back to the original position
        buffer.push(`\x1b[${this.cursor.y + 1};${this.cursor.x + 1}H`)

        // enable cursor back
        buffer.push("\x1b[?25h")

        // TODO: remove this process
        process.stdout.write(buffer.join(""))
    }

    setCurrentRow() {
        this.rows.push({text: this.currentRow})
        this.currentRow = ""
    }
}

let editor = new Editor(process.stdout.rows, process.stdout.columns)
    editor.refreshScreen()

// main
readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)
process.stdin.on("keypress", (str, key) => {
    process.stdout.write(str)
    console.log(key)

    if(key.name == "return") {
        process.stdout.write("\r\n")
    } else {
        editor.currentRow += str
    }

    if(key.sequence == "\u001b[A") {
    }
})