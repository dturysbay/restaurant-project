import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatService, ChatMessage } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const send = (text: string): string => {
    let reply = '';
    const messages: ChatMessage[] = [{ role: 'user', content: text }];
    service.sendMessage(messages).subscribe(r => (reply = r.reply));
    // flush the delay Observable (tick with generous time)
    return reply;
  };

  it('should return a sushi reply for "суши" keyword', fakeAsync(() => {
    let reply = '';
    service.sendMessage([{ role: 'user', content: 'хочу суши' }])
      .subscribe(r => (reply = r.reply));
    tick(2000);
    expect(reply).toBeTruthy();
    expect(reply.toLowerCase()).toMatch(/sushi|суши|ролл|okadzaki|tanuki|sushibox/i);
  }));

  it('should return a burger reply for "бургер" keyword', fakeAsync(() => {
    let reply = '';
    service.sendMessage([{ role: 'user', content: 'хочу бургер' }])
      .subscribe(r => (reply = r.reply));
    tick(2000);
    expect(reply).toMatch(/burger|бургер|popeyes|POPEYES/i);
  }));

  it('should return a pizza reply for "пицца" keyword', fakeAsync(() => {
    let reply = '';
    service.sendMessage([{ role: 'user', content: 'заказать пиццу' }])
      .subscribe(r => (reply = r.reply));
    tick(2000);
    expect(reply).toMatch(/pizza|пицц|базилик/i);
  }));

  it('should return a greeting reply for "привет"', fakeAsync(() => {
    let reply = '';
    service.sendMessage([{ role: 'user', content: 'привет' }])
      .subscribe(r => (reply = r.reply));
    tick(2000);
    expect(reply).toBeTruthy();
    expect(reply.length).toBeGreaterThan(10);
  }));

  it('should return a default reply for unrecognized input', fakeAsync(() => {
    let reply = '';
    service.sendMessage([{ role: 'user', content: 'qwerty xyz 123' }])
      .subscribe(r => (reply = r.reply));
    tick(2000);
    expect(reply).toBeTruthy();
    expect(reply.length).toBeGreaterThan(10);
  }));

  it('should use the last message content for matching', fakeAsync(() => {
    let reply = '';
    const messages: ChatMessage[] = [
      { role: 'user', content: 'привет' },
      { role: 'assistant', content: 'Чем помочь?' },
      { role: 'user', content: 'донер' },
    ];
    service.sendMessage(messages).subscribe(r => (reply = r.reply));
    tick(2000);
    expect(reply).toMatch(/doner|донер|шаурм|mangal/i);
  }));

  it('should emit reply asynchronously (not immediately)', fakeAsync(() => {
    let emitted = false;
    service.sendMessage([{ role: 'user', content: 'hi' }])
      .subscribe(() => (emitted = true));

    expect(emitted).toBeFalse();
    tick(2000);
    expect(emitted).toBeTrue();
  }));
});
