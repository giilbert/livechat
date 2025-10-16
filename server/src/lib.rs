use std::collections::{HashMap, VecDeque};

use maf::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Message {
    name: String,
    content: String,
}

const MAX_MESSAGES: usize = 500;
#[derive(Debug, Serialize)]
struct ChatStore {
    messages: VecDeque<Message>,
    live: HashMap<String, Message>,
}

impl StoreData for ChatStore {
    type Select<'this> = &'this ChatStore;

    fn init() -> Self {
        ChatStore {
            messages: VecDeque::new(),
            live: HashMap::new(),
        }
    }

    fn select(&self, _user: &User) -> Self::Select<'_> {
        self
    }

    fn name() -> impl AsRef<str> {
        "chat"
    }
}

async fn send(Params(msg): Params<Message>, chat: Store<ChatStore>) {
    let mut chat = chat.write().await;
    chat.messages.push_back(msg);

    if chat.messages.len() > MAX_MESSAGES {
        let len = chat.messages.len();
        chat.messages.drain(0..(len - MAX_MESSAGES));
    }
}

async fn live_update(Params(message): Params<Message>, user: User, chat: Store<ChatStore>) {
    let mut chat = chat.write().await;
    chat.live.insert(user.meta().id().to_string(), message);
}

async fn on_disconnect(user: User, chat: Store<ChatStore>) {
    let mut chat = chat.write().await;
    chat.live.remove(&user.meta().id().to_string());
}

async fn on_connect(user: User) {
    println!("user connected! id: {}", user.meta().id());
}

// Declare what the MAF application should do
fn build() -> App {
    App::builder()
        .on_connect(on_connect)
        .store::<ChatStore>()
        .rpc("send", send)
        .rpc("live_update", live_update)
        .on_disconnect(on_disconnect)
        .build()
}

maf::register!(build);
