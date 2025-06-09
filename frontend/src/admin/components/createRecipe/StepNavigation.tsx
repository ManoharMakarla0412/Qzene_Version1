
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  recipeName: string;
  onBack?: () => void;
}

const StepNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  recipeName,
  onBack
}: StepNavigationProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
      <div className="flex items-center space-x-2">
        {onBack && (
          <button onClick={onBack} className="hover:bg-gray-200 p-1 rounded-full">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <span className="font-medium text-lg">{recipeName}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="font-medium mr-4">Step {currentStep} of {totalSteps}</div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPrevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onNextStep}
          disabled={currentStep === totalSteps}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepNavigation;
