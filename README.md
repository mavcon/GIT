# Role Based App

A React application for managing member interactions and communications in a martial arts community.

## Features

- Member management with roles and permissions
- Member profiles with training information
- Connection system (following/blocking)
- Real-time chat functionality
- Dojo management and check-ins
- Stats and achievements tracking

## Storage Service Implementation

The application uses a robust storage service for managing state and real-time updates across components. Located in `src/services/storage.ts`, it implements a pub/sub pattern for real-time data synchronization.

### Core Functionality

1. Event System
```typescript
// Storage events for pub/sub
export const STORAGE_EVENTS = {
  MEMBERS_UPDATED: 'MEMBERS_UPDATED',
  CHATS_UPDATED: 'CHATS_UPDATED',
  NOTIFICATIONS_UPDATED: 'NOTIFICATIONS_UPDATED',
  CONNECTIONS_UPDATED: 'CONNECTIONS_UPDATED'
};
```

2. Event Handling
```typescript
// Dispatch events with data
const dispatchStorageEvent = (eventName: string, data?: any) => {
  if (listeners[eventName]) {
    const event = new CustomEvent(eventName, { detail: data });
    listeners[eventName].forEach(listener => listener(event));
  }
};

// Add event listeners
export const addStorageListener = (eventName: string, listener: Function) => {
  if (!listeners[eventName]) {
    listeners[eventName] = [];
  }
  listeners[eventName].push(listener);
  return () => {
    listeners[eventName] = listeners[eventName].filter(l => l !== listener);
  };
};
```

### Usage in Components

```typescript
// In your context provider
useEffect(() => {
  const handleDataUpdate = (event: CustomEvent<YourDataType[]>) => {
    setData(event.detail);
  };

  const cleanup = storageService.addStorageListener(
    STORAGE_EVENTS.YOUR_EVENT,
    handleDataUpdate
  );

  return cleanup;
}, []);
```

### Best Practices

1. Event Handling:
   - Always include data in event dispatches
   - Type your event data properly
   - Clean up listeners in useEffect returns

2. Storage Operations:
   - Keep operations atomic
   - Dispatch events after successful storage updates
   - Include complete data state in events

3. Error Handling:
   - Validate data before storage
   - Handle storage failures gracefully
   - Provide fallback data when storage is empty

4. Performance:
   - Batch updates when possible
   - Use memoization for expensive operations
   - Clean up unused listeners

## Chat System Implementation

The chat system is implemented using the following components and patterns:

### Core Components

1. `ChatCard.tsx`

   - Split-panel interface with recent chats and active conversation
   - Left panel shows chat list with unread indicators
   - Right panel displays active conversation
   - Real-time message updates
   - Online/offline status indicators

2. `ChatContext.tsx`

   - Global state management for chat functionality
   - Handles message sending/receiving
   - Manages active chat state
   - Tracks unread message counts

3. `ChatDialog.tsx`
   - Modal dialog for chat interactions
   - Used for popup chat windows
   - Shares core functionality with ChatCard

### Types and Interfaces

Located in `src/types/chat.ts`:

```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: { [chatId: string]: Message[] };
}
```

### Database Schema

Located in `src/db/schema.ts`:

```typescript
interface DBChat {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}
```

### Integration Points

1. Members Page (`src/pages/Members.tsx`)

   - Hosts the main chat interface
   - Integrates with member listing
   - Handles chat initialization

2. Member Actions (`src/components/members/MemberActions.tsx`)

   - Chat button in member cards
   - Initiates new conversations

3. App Root (`src/App.tsx`)
   - Provides ChatProvider context
   - Manages global chat state

### Usage

To use the chat system in other components:

```typescript
import { useChat } from "../../context/ChatContext";

const YourComponent = () => {
  const { state, sendMessage, markAsRead, setActiveChat } = useChat();

  // Send a message
  const handleSend = (receiverId: string, text: string) => {
    sendMessage(receiverId, text);
  };

  // Open a chat
  const handleChatOpen = (memberId: string) => {
    const chatId = [currentUserId, memberId].sort().join("-");
    setActiveChat(chatId);
  };
};
```

### Development Notes

1. State Management:

   - Uses React Context for global state
   - Real-time updates through storage service events
   - Optimistic updates for better UX

2. Performance Considerations:

   - Message pagination (to be implemented)
   - Lazy loading of chat history
   - Efficient message storage and retrieval

3. Future Improvements:
   - Message search functionality
   - File attachments
   - Read receipts
   - Typing indicators
   - Message reactions
   - Group chats

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Environment Variables

Create a `.env` file with:

```
REACT_APP_API_URL=your_api_url
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
