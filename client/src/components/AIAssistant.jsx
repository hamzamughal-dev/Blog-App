import React, { useState } from 'react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Agricultural AI Assistant. I can help you with plant disease diagnosis, treatment recommendations, farming best practices, and crop management. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAssistantType, setSelectedAssistantType] = useState('general');

  const assistantTypes = [
    { id: 'general', name: 'General Agriculture', description: 'General farming and agricultural guidance' },
    { id: 'disease', name: 'Disease Expert', description: 'Plant disease identification and treatment' },
    { id: 'crop', name: 'Crop Management', description: 'Crop planning and management advice' },
    { id: 'pest', name: 'Pest Control', description: 'Pest identification and control strategies' }
  ];

  const quickPrompts = [
    'What disease does my plant have?',
    'How to prevent leaf blight?',
    'Best time to plant tomatoes?',
    'Organic pest control methods',
    'Soil preparation techniques',
    'When to harvest my crops?'
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        'general': [
          'Based on common agricultural practices, I recommend checking soil pH levels and ensuring proper drainage...',
          'For optimal crop growth, consider rotating crops every season to prevent soil nutrient depletion...',
          'Regular monitoring of plant health and early intervention can prevent many common agricultural issues...'
        ],
        'disease': [
          'From your description, this sounds like it could be fungal leaf spot. I recommend applying a copper-based fungicide...',
          'The symptoms you\'re describing are consistent with bacterial wilt. Ensure proper field sanitation...',
          'This appears to be a nutrient deficiency. Consider soil testing and appropriate fertilization...'
        ],
        'crop': [
          'For your region, the optimal planting time would be after the last frost date in spring...',
          'Consider companion planting with legumes to naturally improve soil nitrogen levels...',
          'Based on your climate zone, I suggest implementing a crop rotation schedule...'
        ],
        'pest': [
          'For natural pest control, try introducing beneficial insects like ladybugs and lacewings...',
          'Neem oil is an effective organic treatment for many common garden pests...',
          'Consider installing row covers during vulnerable growth stages to prevent pest damage...'
        ]
      };

      const aiMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: responses[selectedAssistantType][Math.floor(Math.random() * responses[selectedAssistantType].length)],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4 pb-4">
                🤖 Agricultural AI Assistant
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Your intelligent companion for farming guidance, disease diagnosis, and crop management
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🤖 AI Powered
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🌿 Smart Farming
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📊 Real-time Help
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            AI Chat Assistant
          </h2>
        </div>
        <div className="p-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Assistant Type Selection */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center">
                <svg className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                🎯 Assistant Type
              </h3>
              <div className="space-y-3">
                {assistantTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedAssistantType(type.id)}
                    className={`w-full text-left p-4 backdrop-blur-md border rounded-2xl transition-all duration-300 transform hover:scale-102 ${
                      selectedAssistantType === type.id
                        ? 'bg-gradient-to-r from-emerald-500/40 to-green-500/40 border-emerald-400/60 shadow-lg'
                        : 'bg-white/30 border-white/30 hover:bg-white/40'
                    }`}
                  >
                    <div className="font-bold text-sm text-emerald-800">{type.name}</div>
                    <div className="text-xs text-emerald-600/80 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
                  <svg className="h-4 w-4 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ⚡ Quick Prompts
                </h4>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-3 text-xs backdrop-blur-md bg-white/30 border border-white/30 hover:bg-white/40 rounded-xl text-emerald-700 transition-all duration-300 transform hover:scale-102 hover:shadow-md"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-emerald-600/10 to-green-600/10 p-4 border-b border-white/20">
                  <h3 className="font-bold text-emerald-800 flex items-center">
                    <svg className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    💬 Conversation
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-col h-96">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl mb-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                                : 'backdrop-blur-md bg-white/50 text-emerald-800 border border-white/40'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.type === 'user' ? 'text-emerald-200' : 'text-emerald-600'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="backdrop-blur-md bg-white/50 border border-white/40 max-w-xs px-4 py-3 rounded-2xl shadow-lg">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs text-emerald-600 font-medium">🤖 AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="💬 Ask me anything about agriculture..."
                          className="w-full p-4 backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none placeholder-emerald-600/60 text-emerald-800 transition-all duration-300 focus:bg-white/50"
                          rows="2"
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 ${
                          !inputMessage.trim() || isTyping
                            ? 'backdrop-blur-md bg-white/30 border border-white/30 text-emerald-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* AI Capabilities */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            🌱 AI Capabilities
          </h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-800 mb-3">🔍 Disease Diagnosis</h3>
              <p className="text-sm text-emerald-700/90 leading-relaxed">Identify plant diseases from symptoms and images with AI precision</p>
            </div>

            <div className="group text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-800 mb-3">💊 Treatment Guidance</h3>
              <p className="text-sm text-emerald-700/90 leading-relaxed">Get personalized treatment recommendations and preventive measures</p>
            </div>

            <div className="group text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-800 mb-3">🌾 Crop Planning</h3>
              <p className="text-sm text-emerald-700/90 leading-relaxed">Optimal planting schedules and intelligent crop rotation advice</p>
            </div>

            <div className="group text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-800 mb-3">🐛 Pest Control</h3>
              <p className="text-sm text-emerald-700/90 leading-relaxed">Identify pests and recommend effective control strategies</p>
            </div>

            <div className="group text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-800 mb-3">🌱 Soil Analysis</h3>
              <p className="text-sm text-emerald-700/90 leading-relaxed">Comprehensive soil health assessment and fertilizer recommendations</p>
            </div>

            <div className="group text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 14l4-4m0 4l-4-4m-4 0v-3a3 3 0 00-3-3H3m3 0h4m4 0v-3a3 3 0 00-3-3H7" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-800 mb-3">☁️ Weather Guidance</h3>
              <p className="text-sm text-emerald-700/90 leading-relaxed">Smart weather-based farming advice and crop protection strategies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            📈 Usage Statistics
          </h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">📋 23</div>
              <div className="text-sm font-medium text-emerald-700">AI Consultations</div>
            </div>
            <div className="text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">🔍 8</div>
              <div className="text-sm font-medium text-emerald-700">Diseases Diagnosed</div>
            </div>
            <div className="text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">📝 15</div>
              <div className="text-sm font-medium text-emerald-700">Treatment Plans</div>
            </div>
            <div className="text-center p-6 backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl hover:bg-white/40 transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">✨ 98%</div>
              <div className="text-sm font-medium text-emerald-700">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;