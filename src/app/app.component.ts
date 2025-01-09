import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'morse'

    keyboardRows = [
        "qwertyuiop".split(''),
        "asdfghjkl".split(''),
        "zxcvbnm".split(''),
    ]

    onMouseDown(event: MouseEvent) {
        (event.target as HTMLElement).classList.add('pressed')
    }

    onMouseUp(event: MouseEvent) {
        (event.target as HTMLElement).classList.remove('pressed')
    }
}
