// HabitTrackerPage.jsx
import { useState } from 'react';
import { useUserData } from '../context/UserDataContext';
import HabitList from '../components/habits/HabitList';
import AddHabitForm from '../components/habits/AddHabitForm';
import HabitStats from '../components/habits/HabitStats';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const HabitTrackerPage = () => {
  const { state, dispatch } = useUserData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      description: habit.description,
      impact: habit.impact,
      frequency: habit.frequency,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
    setShowAddModal(false);
  };

  const toggleHabitCompletion = (habitId) => {
    const habit = state.habits.find(h => h.id === habitId);
    const today = new Date().toISOString().split('T')[0];
    
    const isAlreadyCompleted = habit.completedDates.includes(today);
    let updatedCompletedDates;
    let updatedStreak;
    
    if (isAlreadyCompleted) {
      updatedCompletedDates = habit.completedDates.filter(date => date !== today);
      updatedStreak = Math.max(0, habit.streak - 1);
    } else {
      updatedCompletedDates = [...habit.completedDates, today];
      updatedStreak = habit.streak + 1;
    }
    
    dispatch({
      type: 'UPDATE_HABIT',
      payload: {
        ...habit,
        completedDates: updatedCompletedDates,
        streak: updatedStreak
      }
    });
  };

  const deleteHabit = (habitId) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const filteredHabits = state.habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completedDates.includes(today);
    
    if (filter === 'all') return true;
    if (filter === 'active') return !isCompletedToday;
    if (filter === 'completed') return isCompletedToday;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sustainable Habit Tracker</h1>
        <Button onClick={() => setShowAddModal(true)}>Add New Habit</Button>
      </div>
      
      <HabitStats habits={state.habits} />
      
      <div className="mb-6">
        <div className="flex space-x-4">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              className={`px-4 py-2 rounded-full ${
                filter === filterType 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setFilter(filterType)}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <HabitList 
        habits={filteredHabits} 
        onToggle={toggleHabitCompletion}
        onDelete={deleteHabit}
      />
      
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddHabitForm onSubmit={addHabit} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
};

export default HabitTrackerPage;