import { Component, ElementRef, inject, signal, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
})
export class ChatbotComponent implements AfterViewChecked {
  private chatService = inject(ChatService);
  @ViewChild('messagesEl') private messagesEl!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! 👋 I\'m your food assistant. Tell me your budget or cuisine preference and I\'ll recommend something great!' }
  ]);
  input = '';
  loading = signal(false);

  ngAfterViewChecked(): void {
    if (this.messagesEl) {
      const el = this.messagesEl.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  send(): void {
    const text = this.input.trim();
    if (!text || this.loading()) return;

    this.input = '';
    this.messages.update(msgs => [...msgs, { role: 'user', content: text }]);
    this.loading.set(true);

    this.chatService.sendMessage(this.messages()).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: res.reply }]);
        this.loading.set(false);
      },
      error: () => {
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
        this.loading.set(false);
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
