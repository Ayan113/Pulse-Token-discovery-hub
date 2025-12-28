import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useTokens, useWebSocketConnection } from '@/hooks/useTokenData';
import { Header } from '@/components/trading/Header';
import { TabNavigation } from '@/components/trading/TabNavigation';
import { TokenTable } from '@/components/trading/TokenTable';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PulseContent: React.FC = () => {
  const { refresh } = useTokens();
  useWebSocketConnection();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl flex-1">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <TabNavigation className="w-full sm:w-auto inline-flex" />
        </div>
        <ErrorBoundary>
          <TokenTable onRefresh={refresh} />
        </ErrorBoundary>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.p 
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Made by 
            <span className="font-semibold text-foreground">Ayan Chatterjee</span> 
            with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-danger fill-danger" />
            </motion.span>
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

const PulsePage: React.FC = () => {
  return (
    <Provider store={store}>
      <PulseContent />
    </Provider>
  );
};

export default PulsePage;
