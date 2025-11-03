const { PubSub } = require("graphql-subscriptions");
const { chats } = require("../entities/chat");

const pubSub = new PubSub();
const CHANNEL = "CHAT_CHANNEL";

const resolvers = {
  Query: {
    getChats: () => chats,
  },
  Mutation: {
    createChat: async (_, { name, message }) => {
      const chat = { id: chats.length + 1, name, message };
      chats.push(chat);
      await pubSub.publish(CHANNEL, { messageSent: chat });
      return chat;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: () => pubSub.asyncIterator([CHANNEL]),
    },
  },
};

module.exports = { resolvers };
