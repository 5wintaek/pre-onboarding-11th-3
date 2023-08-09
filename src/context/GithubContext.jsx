import { createContext, useState } from 'react';
import { getIssue, getIssueList } from '@/utils';

const initialContext = {
  issueList: [],
  issue: null,
  fetchIssueList: () => {}, // null
  fetchIssue: () => {},
};

export const GithubContext = createContext(initialContext);

// eslint-disable-next-line react/prop-types
export const GithubProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [issueList, setIssueList] = useState([]);
  const [issue, setIssue] = useState(null);
  const [issueListPage, setIssueListPage] = useState(1);

  const fetchIssueList = async () => {
    setIsLoading(true);
    try {
      const currentPage = issueListPage;
      const data = await getIssueList(10, currentPage);
      setIssueListPage((prev) => prev + 1);
      setIssueList((prevList) => [...prevList, ...data]);
    } catch (error) {
      setFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIssue = async (issueNumber) => {
    setIsLoading(true);
    try {
      const data = await getIssue(issueNumber);
      setIssue(data);
    } catch (error) {
      setFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GithubContext.Provider
      value={{
        issueList,
        fetchIssueList,
        fetchError,
        isLoading,
        issue,
        fetchIssue,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

// GithubContext.displayName = 'GithubContext';
