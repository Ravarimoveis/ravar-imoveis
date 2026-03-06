import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Hardcoded admin credentials (frontend-only authentication)
const ADMIN_CREDENTIALS = {
  'fernando@g2g.org.br': {
    password: 'ravar2024fernando',
    name: 'Fernando'
  },
  'rafaelvrodriguesp@gmail.com': {
    password: 'ravar2024rafael',
    name: 'Rafael'
  }
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('=== Frontend Login (LocalStorage) ===');
      console.log('Email:', email);

      // Validate credentials (frontend-only)
      const emailLower = email.toLowerCase();
      const adminUser = ADMIN_CREDENTIALS[emailLower as keyof typeof ADMIN_CREDENTIALS];

      if (!adminUser) {
        console.log('❌ User not found');
        toast.error('Credenciais inválidas');
        setLoading(false);
        return;
      }

      if (adminUser.password !== password) {
        console.log('❌ Wrong password');
        toast.error('Credenciais inválidas');
        setLoading(false);
        return;
      }

      console.log('✅ Login successful!');

      // Store authentication in localStorage
      const authToken = `${emailLower}:${Date.now()}`;
      localStorage.setItem('admin_access_token', authToken);
      localStorage.setItem('admin_user', JSON.stringify({
        email: emailLower,
        name: adminUser.name
      }));

      console.log('Token saved to localStorage:', authToken);

      toast.success(`Bem-vindo, ${adminUser.name}!`);
      
      // Navigate to admin panel
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#1a2332] border-[#AF9042]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#AF9042] mb-2">RAVAR</h1>
          <p className="text-gray-400">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-[#0A1929] border-gray-700 text-white"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="bg-[#0A1929] border-gray-700 text-white"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#AF9042] hover:bg-[#8f7635] text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sistema de autenticação local</p>
        </div>
      </Card>
    </div>
  );
}