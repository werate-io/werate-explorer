import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'; // Import your shadcn Card component
import { Button } from '@/components/ui/Button'; // Import your shadcn Button component
import React from 'react';

interface PopupContentProps {
  title: string;
  content: string;
  rating: number;
  onClick?: () => void;
}

export const PopupContent: React.FC<PopupContentProps> = ({ title, content, rating, onClick }) => {
  return (
    <Card className="w-full animate-slide-up shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <p className="mt-2">
          Rating: {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="default" onClick={onClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
