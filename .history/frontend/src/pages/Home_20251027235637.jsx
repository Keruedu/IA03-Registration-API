import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1f2e] via-[#1f2937] to-[#2a3142] p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-4xl font-bold text-foreground">Welcome</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-2">
            User Registration System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <p className="text-center text-muted-foreground text-sm">
            A complete authentication system with React and NestJS
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full font-bold text-base shadow-lg hover:shadow-xl transition-all">
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full font-semibold border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
