/* eslint-disable no-console */
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';

const server: Server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

const io = new SocketIOServer(server, {
  cors: { origin: 'http://localhost:5173' },
});

io.on('connection', socket => {
  console.log(`A user connected: ${socket?.id}`);

  socket.on('auctionRoom', productId => {
    socket.broadcast.emit('receive_message', productId);
  });

  socket.on('messageRoom', productId => {
    socket.broadcast.emit('receive_message2', productId);
  });

  // socket.on('join auction', room => {
  //   socket.join(room);
  //   console.log('User joined Room ' + room);
  // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle other Socket.IO events here
});

async function bootstrap() {
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorLogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();

export { io };
