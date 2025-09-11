const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const { author, genre } = args

      const filter = {}

      // If author param is given → find the author's _id
      if (author) {
        const authorDoc = await Author.findOne({ name: author })
        if (!authorDoc) {
          return [] // no such author
        }
        filter.author = authorDoc._id
      }

      // If genre param is given → filter by genre
      if (genre) {
        filter.genres = { $in: [genre] }
      }

      // Always populate author so GraphQL gets the object, not just _id
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      //   const authorBooks = await Book.find({ author: root })
      console.log('root -->', root)
      return root.books.length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const { title, published, author, genres } = args

      try {
        let bookAuthor = await Author.findOne({ name: author })

        if (!bookAuthor) {
          bookAuthor = new Author({ name: author })
          await bookAuthor.save()
        }

        const book = new Book({
          title,
          published,
          genres,
          author: bookAuthor._id,
        })

        const savedBook = await book.save()
        bookAuthor.books = bookAuthor.books.concat(savedBook._id)
        await bookAuthor.save()

        pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })

        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: error.message,
          },
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const { name, setBornTo } = args
      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name },
          { born: setBornTo },
          { new: true }
        )
        return updatedAuthor
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: error.message,
          },
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre || '',
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
