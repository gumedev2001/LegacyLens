'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type QuickReply = {
  id: string;
  text: string;
  leadsTo: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente de LegacyLens. Estoy aquí para ayudarte a preservar las historias de tu familia. ¿De qué miembro de tu familia te gustaría guardar recuerdos hoy?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickReplies: QuickReply[] = [
    { id: 'qr1', text: '👴 Mi abuelo/abuela', leadsTo: 'abuelo' },
    { id: 'qr2', text: '👨‍👩‍👧 Mis padres', leadsTo: 'padres' },
    { id: 'qr3', text: '👶 Mi infancia', leadsTo: 'infancia' },
    { id: 'qr4', text: '💑 Historia de amor familiar', leadsTo: 'amor' },
  ];

  const botResponses: { [key: string]: string } = {
    abuelo: '¡Qué maravilloso! Los abuelos son tesoros de sabiduría. ¿Sabías que preguntar sobre su primer trabajo o cómo conocieron a su pareja puede revelar historias increíbles? ¿Qué te gustaría saber específicamente sobre tu abuelo/abuela?',
    padres: 'Tus padres tienen tantas historias por contar. ¿Te gustaría preservar momentos de su juventud, cómo se conocieron, o quizás consejos que te han dado para la vida?',
    infancia: 'La infancia está llena de momentos mágicos. Podemos preservar historias sobre tus primeros amigos, juguetes favoritos, o esas travesuras que ahora hacen reír a la familia.',
    amor: 'Las historias de amor familiar son las más especiales. ¿Te gustaría capturar cómo se conocieron tus abuelos, el día de la boda de tus padres, o quizás tu propia historia de amor?',
    default: '¡Excelente elección! Cada historia familiar es única y valiosa. ¿Hay algún momento o anécdota específica que te gustaría preservar para las futuras generaciones?',
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuickReply = (reply: QuickReply, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simular respuesta del bot después de un delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[reply.leadsTo] || botResponses.default,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleInfoButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Redirigir al registro...');
    // Aquí podríamos agregar lógica para redirigir al registro
  };

  return (
    <section className={styles.chatbotSection} id="chatbot-demo">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Habla con nuestro Entrevistador AI</h2>
          <p className={styles.subtitle}>
            Experimenta cómo nuestra inteligencia artificial te ayuda a descubrir y preservar 
            las historias más valiosas de tu familia con preguntas inteligentes y personalizadas.
          </p>
        </div>

        <div className={styles.chatbotContainer}>
          {/* Chatbot */}
          <div className={styles.chatbot}>
            <div className={styles.chatHeader}>
              <div className={styles.chatAvatar}>AI</div>
              <div className={styles.chatInfo}>
                <h3>Entrevistador LegacyLens</h3>
                <p>En línea - Especialista en historias familiares</p>
              </div>
            </div>

            <div 
              className={styles.chatMessages}
              ref={chatContainerRef}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.isUser ? styles.messageUser : ''
                  }`}
                >
                  <div
                    className={`${styles.messageAvatar} ${
                      message.isUser ? styles.userAvatar : styles.botAvatar
                    }`}
                  >
                    {message.isUser ? 'Tú' : 'AI'}
                  </div>
                  <div className={styles.messageContent}>
                    <div
                      className={`${styles.messageBubble} ${
                        message.isUser ? styles.userBubble : styles.botBubble
                      }`}
                    >
                      {message.text}
                    </div>
                    {!message.isUser && message.id === messages[messages.length - 1]?.id && (
                      <div className={styles.quickReplies}>
                        {quickReplies.map((reply) => (
                          <button
                            key={reply.id}
                            className={styles.quickReply}
                            onClick={(e) => handleQuickReply(reply, e)}
                            type="button"
                          >
                            {reply.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className={styles.message}>
                  <div className={`${styles.messageAvatar} ${styles.botAvatar}`}>
                    AI
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Info Panel */}
          <div className={styles.demoInfo}>
            <h3>¿Cómo funciona?</h3>
            <ul className={styles.featureList}>
              <li>
                <div className={styles.featureIcon}>💬</div>
                <span>Preguntas inteligentes que evocan recuerdos profundos</span>
              </li>
              <li>
                <div className={styles.featureIcon}>🎯</div>
                <span>Personalizado según la persona y época</span>
              </li>
              <li>
                <div className={styles.featureIcon}>📝</div>
                <span>Guía paso a paso para capturar cada detalle</span>
              </li>
              <li>
                <div className={styles.featureIcon}>🔄</div>
                <span>Adapta las preguntas basado en tus respuestas</span>
              </li>
            </ul>
            <button 
              className={styles.subscribeButton}
              type="button"
              onClick={handleInfoButtonClick}
            >
              Comenzar con Mi Familia
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}