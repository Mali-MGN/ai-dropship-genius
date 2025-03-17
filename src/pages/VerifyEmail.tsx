
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function VerifyEmail() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Please check your email and click on the verification link to complete your registration.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Didn't receive an email?</p>
            <p className="text-sm text-gray-500">
              Check your spam folder or request a new verification link.
            </p>
            <Button variant="outline" className="mt-2">
              Resend verification email
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
