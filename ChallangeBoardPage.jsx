// ChallengeBoardPage.jsx
import { useEffect, useState } from 'react';
import { useUserData } from '../context/UserDataContext';
import { fetchChallenges } from '../services/challengeService';
import ChallengeBoard from '../components/challenges/ChallengeBoard';
import ChallengeDetails from '../components/challenges/ChallengeDetails';
import LeaderboardSection from '../components/challenges/LeaderboardSection';
import Loading from '../components/common/Loading';

const ChallengeBoardPage = () => {
  const { state, dispatch } = useUserData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed', 'upcoming'

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        const challenges = await fetchChallenges();
        dispatch({ type: 'SET_CHALLENGES', payload: challenges });
      } catch (err) {
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [dispatch]);

  const joinChallenge = (challengeId) => {
    dispatch({
      type: 'JOIN_CHALLENGE',
      payload: {
        challengeId,
        userId: state.profile.id,
        joinedAt: new Date().toISOString(),
      },
    });
  };

  const leaveChallenge = (challengeId) => {
    dispatch({
      type: 'LEAVE_CHALLENGE',
      payload: {
        challengeId,
        userId: state.profile.id,
      },
    });
  };

  const updateProgress = (challengeId, progress) => {
    dispatch({
      type: 'UPDATE_CHALLENGE_PROGRESS',
      payload: {
        challengeId,
        userId: state.profile.id,
        progress,
      },
    });
  };

  const filteredChallenges = state.challenges.filter((challenge) => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const isActive = startDate <= now && endDate >= now;
    const isUpcoming = startDate > now;
    const isCompleted = endDate < now;
    const userParticipation = challenge.participants?.find(
      (p) => p.userId === state.profile?.id
    );
    const isJoined = !!userParticipation;

    if (filter === 'all') return true;
    if (filter === 'active') return isActive;
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'completed') return isCompleted;
    if (filter === 'joined') return isJoined;
    return true;
  });

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Eco-Challenge Community Board</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'upcoming', 'completed', 'joined'].map((filterType) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {selectedChallenge ? (
            <ChallengeDetails
              challenge={selectedChallenge}
              userProfile={state.profile}
              onBack={() => setSelectedChallenge(null)}
              onJoin={joinChallenge}
              onLeave={leaveChallenge}
              onUpdateProgress={updateProgress}
            />
          ) : (
            <ChallengeBoard
              challenges={filteredChallenges}
              onSelectChallenge={setSelectedChallenge}
              userProfile={state.profile}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <LeaderboardSection challenges={state.challenges} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeBoardPage;
