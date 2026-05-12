import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const REPLIES: Array<{ pattern: RegExp; replies: string[] }> = [
  {
    pattern: /sushi|japanese|ролл|суши|японск/i,
    replies: [
      'For sushi lovers, try Okadzaki (4th microdistrict) — they do great rolls and udon. TANUKI on Satpayeva is also very popular with a 8.4 ★ rating! 🍣',
      'NHY by Zubarefff and Manga на Тлендиева are both solid Japanese options in the city. SUSHIBOX is great if you want rolls with a burger twist too! 🍱',
    ],
  },
  {
    pattern: /burger|бургер|american|американ/i,
    replies: [
      "Burger fans — POPEYES Abay Plaza has amazing crispy chicken burgers (8.2 ★). Burger King Moscow Mall is a reliable classic. I'M Мамыр is a local favourite with a 8.2 ★ rating! 🍔",
      'Try Rommi Burger on Ukhtomskogo for something local, or go with Burger na Satpayeva Ыкылас for a quick bite. Both solid choices! 🍔',
    ],
  },
  {
    pattern: /pizza|пицца|italian|итальян/i,
    replies: [
      'Базилик Аксай is the top pizza pick — 8.4 ★ with over 2,000 ratings! Pikapika does sushi & pizza combo if you can\'t decide. 🍕',
      'For Italian vibes, Алые Паруса in MOSKVA Metropolitan is worth a visit. Great dough, great atmosphere. 🍕',
    ],
  },
  {
    pattern: /doner|донер|shawarma|шаурма|turkish|турецк/i,
    replies: [
      'Doner na Satpayeva Сары Арка is a local staple — 8.4 ★ and 30 min delivery! Mangal Doner Жетысу is also excellent. 🥙',
      'Donerzade on 5th microdistrict does great doner wraps. Fast and affordable! 🥙',
    ],
  },
  {
    pattern: /korean|корейск/i,
    replies: [
      'Nanduk Абая brings authentic Korean flavours — 7.2 ★ with quick 35 min delivery. Mogo&Go Altynsaryn is another Korean gem worth checking out! 🍜',
    ],
  },
  {
    pattern: /cheap|budget|afford|недорог|дёшев/i,
    replies: [
      'On a budget? KFC Saryarka and Doner na Satpayeva both deliver in 30 min with low minimum orders. Mangal Burger Ыкылас is also great value! 💰',
      'Burger na Satpayeva and local doner spots are your best bet for tasty food without breaking the bank. 💰',
    ],
  },
  {
    pattern: /fast|quick|быстр|speed/i,
    replies: [
      "Need it fast? I'M Мамыр delivers in just 25 min (8.2 ★). POPEYES Abay Plaza and most doner spots are 30 min. ⚡",
    ],
  },
  {
    pattern: /best|top|recommend|лучш|посоветуй/i,
    replies: [
      'Top picks right now: Базилик Аксай (8.4 ★ pizza), Mangal Doner Жетысу (8.4 ★ doner), POPEYES Abay Plaza (8.2 ★ chicken). All excellent choices! ⭐',
      "Can't go wrong with SUSHIBOX Аксай (8.4 ★), Okadzaki 4-й микрорайон (8.4 ★), or I'M Мамыр (8.2 ★ burgers). Highly rated and reliable! ⭐",
    ],
  },
  {
    pattern: /hello|hi|hey|привет|салем/i,
    replies: [
      "Hey there! 👋 I'm here to help you find the perfect meal. Tell me what cuisine you're in the mood for, or give me a budget and I'll suggest something great!",
    ],
  },
];

const DEFAULT_REPLIES = [
  "Hmm, I'm not sure about that one! Try asking me about sushi, burgers, pizza, or doner — or just say 'recommend something' and I'll pick a top spot for you! 😊",
  "I know a lot about the restaurants in our catalogue! Ask me about any cuisine, your budget, or how fast you want delivery. 🍽️",
];

@Injectable({ providedIn: 'root' })
export class ChatService {
  sendMessage(messages: ChatMessage[]): Observable<{ reply: string }> {
    const last = messages[messages.length - 1].content;
    const reply = this.simulate(last);
    const ms = 600 + Math.random() * 900;
    return of({ reply }).pipe(delay(ms));
  }

  private simulate(input: string): string {
    for (const { pattern, replies } of REPLIES) {
      if (pattern.test(input)) {
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }
    return DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
  }
}
