import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-t-lg py-8">
          <CardTitle className="text-4xl font-bold">Welcome</CardTitle>
          <CardDescription className="text-lg text-blue-100">
            User Registration System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8 bg-white">
          <p className="text-center text-gray-700 text-lg">
            A complete authentication system with React and NestJS
          </p>
          <div className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 text-lg shadow-lg">
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button asChild size="lg" className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-lg">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
