// CarbonCalculator.jsx
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { calculateCarbonFootprint } from '../../services/carbonCalculator';
import TransportSection from './TransportSection';
import HomeEnergySection from './HomeEnergySection';
import FoodSection from './FoodSection';
import ResultsSection from './ResultsSection';
import Button from '../common/Button';
import { validateCalculatorForm } from '../../utils/validation';

const CarbonCalculator = () => {
  const { state, dispatch } = useUserData();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    transport: { carMiles: 0, publicTransportMiles: 0, flightHours: 0 },
    homeEnergy: { electricityKwh: 0, gasKwh: 0, renewablePercentage: 0 },
    food: { meatConsumption: 'medium', localFoodPercentage: 0, wastePercentage: 0 }
  });
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = () => {
    const currentSection = ['transport', 'homeEnergy', 'food'][activeStep];
    const stepErrors = validateCalculatorForm(formData[currentSection], currentSection);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep < 2) {
        setActiveStep(prev => prev + 1);
      } else {
        calculateResults();
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const calculateResults = async () => {
    try {
      const footprint = await calculateCarbonFootprint(formData);
      setResults(footprint);
      dispatch({ type: 'UPDATE_CARBON_FOOTPRINT', payload: footprint });
    } catch (error) {
      setErrors({ general: 'Failed to calculate carbon footprint' });
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <TransportSection 
            data={formData.transport} 
            onChange={(field, value) => handleChange('transport', field, value)}
            errors={errors}
          />
        );
      case 1:
        return (
          <HomeEnergySection 
            data={formData.homeEnergy} 
            onChange={(field, value) => handleChange('homeEnergy', field, value)}
            errors={errors}
          />
        );
      case 2:
        return (
          <FoodSection 
            data={formData.food} 
            onChange={(field, value) => handleChange('food', field, value)}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Carbon Footprint Calculator</h2>
      
      {results ? (
        <ResultsSection results={results} />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {['Transportation', 'Home Energy', 'Food & Waste'].map((step, index) => (
                <div 
                  key={step} 
                  className={`text-sm ${index <= activeStep ? 'text-green-600 font-semibold' : 'text-gray-400'}`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${((activeStep + 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderStep()}

          {errors.general && (
            <div className="text-red-500 mb-4">{errors.general}</div>
          )}

          <div className="flex justify-between mt-6">
            <Button 
              onClick={handleBack} 
              disabled={activeStep === 0}
              variant="outline"
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {activeStep < 2 ? 'Next' : 'Calculate'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarbonCalculator;