/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DiffSide, SubjectType, ViewedState } from '../common/comment';
import { ForkDetails } from './githubRepository';

interface PageInfo {
	hasNextPage: boolean;
	endCursor: string;
}

export interface MergedEvent {
	__typename: string;
	id: string;
	actor: Actor;
	createdAt: string;
	mergeRef: {
		name: string;
	};
	commit: {
		oid: string;
		commitUrl: string;
	};
	url: string;
}

export interface HeadRefDeletedEvent {
	__typename: string;
	id: string;
	actor: Actor;
	createdAt: string;
	headRefName: string;
}

export interface CrossReferencedEvent {
	__typename: string;
	id: string;
	actor: Actor;
	createdAt: string;
	source: {
		__typename: string;
		number: number;
		url: string;
		title: string;
		repository: {
			name: string;
			owner: {
				login: string;
			};
		}
	};
	willCloseTarget: boolean;
}

export interface ClosedEvent {
	__typename: string;
	id: string;
	actor: Actor;
	createdAt: string;
}

export interface ReopenedEvent {
	__typename: string;
	id: string;
	actor: Actor;
	createdAt: string;
}

export interface AbbreviatedIssueComment {
	author: Account;
	body: string;
	databaseId: number;
	reactions: {
		totalCount: number;
	};
	reactionGroups: ReactionGroup[]
	createdAt: string;
}

export interface IssueComment extends AbbreviatedIssueComment {
	__typename: string;
	authorAssociation: string;
	id: string;
	url: string;
	bodyHTML: string;
	updatedAt: string;
	createdAt: string;
	viewerCanUpdate: boolean;
	viewerCanReact: boolean;
	viewerCanDelete: boolean;
}

export interface ReactionGroup {
	content: string;
	viewerHasReacted: boolean;
	reactors: {
		nodes: {
			login: string;
		}[]
		totalCount: number;
	};
}

export interface Node {
	id: string;
}

export interface Actor {
	__typename: string;
	id: string;
	login: string;
	avatarUrl: string;
	url: string;
}

export interface Account extends Actor {
	name: string;
	email: string;
}

export function isAccount(x: Actor | Team | Node | undefined | null): x is Account {
	return !!x && 'name' in x && 'email' in x;
}

export function isTeam(x: Actor | Team | Node | undefined | null): x is Team {
	return !!x && 'slug' in x;
}

export interface Team {
	avatarUrl: string;
	name: string;
	url: string;
	repositories: {
		nodes: {
			name: string
		}[];
	};
	slug: string;
	id: string;
}

export interface ReviewComment {
	__typename: string;
	id: string;
	databaseId: number;
	url: string;
	author?: Actor | Account;
	path: string;
	originalPosition: number;
	body: string;
	bodyHTML: string;
	diffHunk: string;
	position: number;
	state: string;
	pullRequestReview: {
		databaseId: number;
	};
	commit: {
		oid: string;
	};
	originalCommit: {
		oid: string;
	};
	createdAt: string;
	replyTo: {
		databaseId: number;
	};
	reactionGroups: ReactionGroup[];
	viewerCanUpdate: boolean;
	viewerCanDelete: boolean;
}

export interface Commit {
	__typename: string;
	id: string;
	commit: {
		author: {
			user: Account;
		};
		committer: {
			avatarUrl: string;
			name: string;
		};
		oid: string;
		message: string;
		committedDate: Date;
	};

	url: string;
}

export interface AssignedEvent {
	__typename: string;
	id: number;
	actor: Actor;
	user: Account;
	createdAt: string;
}

export interface UnassignedEvent {
	__typename: string;
	id: number;
	actor: Actor;
	user: Account;
	createdAt: string;
}

export interface MergeQueueEntry {
	position: number;
	state: MergeQueueState;
	mergeQueue: {
		url: string;
	}
}

export interface Review {
	__typename: string;
	id: string;
	databaseId: number;
	authorAssociation: string;
	url: string;
	author: Actor | Account;
	state: 'COMMENTED' | 'APPROVED' | 'CHANGES_REQUESTED' | 'PENDING';
	body: string;
	bodyHTML?: string;
	submittedAt: string;
	updatedAt: string;
	createdAt: string;
	reactionGroups: ReactionGroup[];
}

export interface ReviewThread {
	id: string;
	isResolved: boolean;
	viewerCanResolve: boolean;
	viewerCanUnresolve: boolean;
	path: string;
	diffSide: DiffSide;
	startLine: number | null;
	line: number;
	originalStartLine: number | null;
	originalLine: number;
	isOutdated: boolean;
	subjectType?: SubjectType;
	comments: {
		nodes: ReviewComment[];
		edges: [{
			node: {
				pullRequestReview?: {
					databaseId: number
				}
			}
		}]
	};
}

export interface TimelineEventsResponse {
	repository: {
		pullRequest: {
			timelineItems: {
				nodes: (MergedEvent | Review | IssueComment | Commit | AssignedEvent | HeadRefDeletedEvent)[];
			};
		};
	} | null;
	rateLimit: RateLimit;
}

export interface LatestCommit {
	commit: {
		committedDate: string;
	}
}

export interface LatestReviewThread {
	comments: {
		nodes: {
			createdAt: string;
		}[];
	}
}

export interface LatestUpdatesResponse {
	repository: {
		pullRequest: {
			reactions: {
				nodes: {
					createdAt: string;
				}[];
			}
			updatedAt: string;
			comments: {
				nodes: {
					updatedAt: string;
					reactions: {
						nodes: {
							createdAt: string;
						}[];
					}
				}[];
			}
			timelineItems: {
				nodes: ({
					createdAt: string;
				} | LatestCommit | LatestReviewThread)[];
			}
		}
	}
}

export interface LatestReviewCommitResponse {
	repository: {
		pullRequest: {
			viewerLatestReview: {
				commit: {
					oid: string;
				}
			};
		};
	} | null;
}

export interface PendingReviewIdResponse {
	node: {
		reviews: {
			nodes: Review[];
		};
	};
	rateLimit: RateLimit;
}

export interface GetReviewRequestsResponse {
	repository: {
		pullRequest: {
			reviewRequests: {
				nodes: {
					requestedReviewer: Actor | Account | Team | Node | null;
				}[];
			};
		};
	} | null;
}

export interface PullRequestState {
	repository: {
		pullRequest: {
			title: string;
			number: number;
			state: 'OPEN' | 'CLOSED' | 'MERGED';
		};
	} | null;
}

export interface PullRequestTemplatesResponse {
	repository: {
		pullRequestTemplates: {
			body: string;
		}[]
	}
}

export interface PullRequestCommentsResponse {
	repository: {
		pullRequest: {
			reviewThreads: {
				nodes: ReviewThread[];
				pageInfo: PageInfo;
			};
		};
	} | null;
}

export interface MentionableUsersResponse {
	repository: {
		mentionableUsers: {
			nodes: Account[];
			pageInfo: PageInfo;
		};
	} | null;
	rateLimit: RateLimit;
}

export interface AssignableUsersResponse {
	repository: {
		assignableUsers: {
			nodes: Account[];
			pageInfo: PageInfo;
		};
	} | null;
	rateLimit: RateLimit;
}

export interface SuggestedActorsResponse {
	repository: {
		suggestedActors: {
			nodes: Actor[];
			pageInfo: PageInfo;
		};
	} | null;
	rateLimit: RateLimit;
}

export interface OrganizationTeamsCountResponse {
	organization: {
		teams: {
			totalCount: number;
		};
	};
}

export interface OrganizationTeamsResponse {
	organization: {
		teams: {
			nodes: Team[];
			totalCount: number;
			pageInfo: PageInfo;
		};
	};
	rateLimit: RateLimit;
}

export interface PullRequestParticipantsResponse {
	repository: {
		pullRequest: {
			participants: {
				nodes: Account[];
			};
		};
	} | null;
}

export interface CreatePullRequestResponse {
	createPullRequest: {
		pullRequest: PullRequest
	}
}

export interface RevertPullRequestResponse {
	revertPullRequest: {
		revertPullRequest: PullRequest
	}
}

export interface AddReviewThreadResponse {
	addPullRequestReviewThread: {
		thread: ReviewThread;
	}
}

export interface AddCommentResponse {
	addPullRequestReviewComment: {
		comment: ReviewComment;
	};
}

export interface AddIssueCommentResponse {
	addComment: {
		commentEdge: {
			node: IssueComment;
		};
	};
}

export interface EditCommentResponse {
	updatePullRequestReviewComment: {
		pullRequestReviewComment: ReviewComment;
	};
}

export interface EditIssueCommentResponse {
	updateIssueComment: {
		issueComment: IssueComment;
	};
}

export interface MarkPullRequestReadyForReviewResponse {
	markPullRequestReadyForReview: {
		pullRequest: {
			isDraft: boolean;
			mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
			mergeStateStatus: 'BEHIND' | 'BLOCKED' | 'CLEAN' | 'DIRTY' | 'HAS_HOOKS' | 'UNKNOWN' | 'UNSTABLE';
			viewerCanEnableAutoMerge: boolean;
			viewerCanDisableAutoMerge: boolean;
		};
	};
}

export interface MergeQueueForBranchResponse {
	repository: {
		mergeQueue?: {
			configuration?: {
				mergeMethod: MergeMethod;
			}
		}
	}
}

export interface DequeuePullRequestResponse {
	mergeQueueEntry: MergeQueueEntry;
}

export interface EnqueuePullRequestResponse {
	enqueuePullRequest: {
		mergeQueueEntry: MergeQueueEntry;
	}
}

export interface SubmittedReview extends Review {
	comments: {
		nodes: ReviewComment[];
	};
}

export interface SubmitReviewResponse {
	submitPullRequestReview: {
		pullRequestReview: SubmittedReview;
	};
}

export interface DeleteReviewResponse {
	deletePullRequestReview: {
		pullRequestReview: {
			databaseId: number;
			comments: {
				nodes: ReviewComment[];
			};
		};
	};
}

export interface AddReactionResponse {
	addReaction: {
		reaction: {
			content: string;
		};
		subject: {
			reactionGroups: ReactionGroup[];
		};
	};
}

export interface DeleteReactionResponse {
	removeReaction: {
		reaction: {
			content: string;
		};
		subject: {
			reactionGroups: ReactionGroup[];
		};
	};
}

export interface UpdateIssueResponse {
	updateIssue: {
		issue: {
			body: string;
			bodyHTML: string;
			title: string;
			titleHTML: string;
			milestone?: {
				title: string;
				dueOn?: string;
				id: string;
				createdAt: string;
				number: number;
			};
		};
	};
}

export interface AddPullRequestToProjectResponse {
	addProjectV2ItemById: {
		item: {
			id: string;
		};
	};
}

export interface GetBranchResponse {
	repository: {
		ref: {
			target: {
				oid: string;
			}
		} | null;
	} | null;
}

export interface ListBranchesResponse {
	repository: {
		refs: {
			nodes: {
				name: string;
			}[];
			pageInfo: PageInfo;
		};
	} | null;
}

export interface RefRepository {
	isInOrganization: boolean;
	owner: {
		login: string;
	};
	url: string;
}

export interface BaseRefRepository extends RefRepository {
	squashMergeCommitTitle?: DefaultCommitTitle;
	squashMergeCommitMessage?: DefaultCommitMessage;
	mergeCommitMessage?: DefaultCommitMessage;
	mergeCommitTitle?: DefaultCommitTitle;
}

export interface Ref {
	name: string;
	repository: RefRepository;
	target: {
		oid: string;
	};
}

export interface SuggestedReviewerResponse {
	isAuthor: boolean;
	isCommenter: boolean;
	reviewer: Actor | Account;
}

export type MergeMethod = 'MERGE' | 'REBASE' | 'SQUASH';
export type MergeQueueState = 'AWAITING_CHECKS' | 'LOCKED' | 'MERGEABLE' | 'QUEUED' | 'UNMERGEABLE';

export interface Issue {
	id: string;
	databaseId: number;
	number: number;
	url: string;
	state: 'OPEN' | 'CLOSED' | 'MERGED'; // TODO: don't allow merged in an issue
	body: string;
	bodyHTML: string;
	title: string;
	titleHTML: string;
	assignees?: {
		nodes: Account[];
	};
	author: Account;
	comments: {
		nodes?: AbbreviatedIssueComment[];
		totalCount: number;
	};
	createdAt: string;
	updatedAt: string;
	labels: {
		nodes: {
			name: string;
			color: string;
		}[];
	};
	viewerCanUpdate: boolean;
	projectItems?: {
		nodes: {
			project: {
				id: string;
				title: string;
			},
			id: string
		}[];
	};
	milestone?: {
		title: string;
		dueOn?: string;
		id: string;
		createdAt: string;
		number: number;
	};
	repository?: {
		name: string;
		owner: {
			login: string;
		};
		url: string;
	};
	reactions: {
		totalCount: number;
	}
	reactionGroups: ReactionGroup[];
}


export interface PullRequest extends Issue {
	commits: {
		nodes: {
			commit: {
				message: string;
			};
		}[];
	};
	headRef?: Ref;
	headRefName: string;
	headRefOid: string;
	headRepository?: RefRepository;
	baseRef?: Ref;
	baseRefName: string;
	baseRefOid: string;
	baseRepository: BaseRefRepository;
	merged: boolean;
	mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
	mergeQueueEntry?: MergeQueueEntry | null;
	mergeStateStatus: 'BEHIND' | 'BLOCKED' | 'CLEAN' | 'DIRTY' | 'HAS_HOOKS' | 'UNKNOWN' | 'UNSTABLE';
	reviewThreads: {
		totalCount: number;
	}
	autoMergeRequest?: {
		mergeMethod: MergeMethod;
	};
	viewerCanEnableAutoMerge: boolean;
	viewerCanDisableAutoMerge: boolean;
	isDraft?: boolean;
	suggestedReviewers: SuggestedReviewerResponse[];
}

export enum DefaultCommitTitle {
	prTitle = 'PR_TITLE',
	commitOrPrTitle = 'COMMIT_OR_PR_TITLE',
	mergeMessage = 'MERGE_MESSAGE'
}

export enum DefaultCommitMessage {
	prBody = 'PR_BODY',
	commitMessages = 'COMMIT_MESSAGES',
	blank = 'BLANK',
	prTitle = 'PR_TITLE'
}

export interface PullRequestResponse {
	repository: {
		pullRequest: PullRequest;
	} | null;
	rateLimit: RateLimit;
}

export interface IssueResponse {
	repository: {
		issue: PullRequest;
	} | null;
	rateLimit: RateLimit;
}

export interface PullRequestMergabilityResponse {
	repository: {
		pullRequest: {
			mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
			mergeStateStatus: 'BEHIND' | 'BLOCKED' | 'CLEAN' | 'DIRTY' | 'HAS_HOOKS' | 'UNKNOWN' | 'UNSTABLE';
			mergeRequirements?: {
				conditions: {
					__typename: string | 'PullRequestMergeConflictStateCondition';
					result: 'PASSED' | 'FAILED';
					conflicts: string[];
				}[];
			}
		};
	} | null;
	rateLimit: RateLimit;
}

export interface IssuesSearchResponse {
	search: {
		issueCount: number;
		pageInfo: PageInfo;
		edges: {
			node: PullRequest;
		}[];
	};
	rateLimit: RateLimit;
}

export interface RepoProjectsResponse {
	repository: {
		projectsV2: {
			nodes: {
				title: string;
				id: string;
			}[];
		}
	} | null;
}

export interface OrgProjectsResponse {
	organization: {
		projectsV2: {
			nodes: {
				title: string;
				id: string;
			}[];
			pageInfo: PageInfo;
		}
	}
}

export interface MilestoneIssuesResponse {
	repository: {
		milestones: {
			nodes: {
				dueOn: string;
				createdAt: string;
				title: string;
				id: string;
				number: number
				issues: {
					edges: {
						node: PullRequest;
					}[];
				};
			}[];
			pageInfo: PageInfo;
		};
	} | null;
}

export interface IssuesResponse {
	repository: {
		issues: {
			edges: {
				node: PullRequest;
			}[];
			pageInfo: PageInfo;
		};
	} | null;
}

export interface PullRequestsResponse {
	repository: {
		pullRequests: {
			nodes: PullRequest[]
		}
	} | null;
}

export interface MaxIssueResponse {
	repository: {
		issues: {
			edges: {
				node: {
					number: number;
				};
			}[];
		};
	} | null;
}

export interface ViewerPermissionResponse {
	repository: {
		viewerPermission: string;
	} | null;
}

export interface ForkDetailsResponse {
	repository: ForkDetails;
}

export interface QueryWithRateLimit {
	rateLimit: RateLimit;
}
export interface RateLimit {
	limit: number;
	cost: number;
	remaining: number;
	resetAt: string;
}

export interface ContributionsCollection {
	commitContributionsByRepository: {
		contributions: {
			nodes: {
				occurredAt: string;
			}[];
		};
		repository: {
			nameWithOwner: string;
		};
	}[];
}

export interface UserResponse {
	user: {
		login: string;
		avatarUrl?: string;
		bio?: string;
		company?: string;
		location?: string;
		name: string;
		contributionsCollection: ContributionsCollection;
		url: string;
		id: string;
		__typename: string;
	};
}

export interface FileContentResponse {
	repository: {
		object: {
			text: string | undefined;
		}
	} | null;
}

export interface StartReviewResponse {
	addPullRequestReview: {
		pullRequestReview: {
			id: string;
		};
	};
}

export interface StatusContext {
	__typename: string;
	id: string;
	state: 'ERROR' | 'EXPECTED' | 'FAILURE' | 'PENDING' | 'SUCCESS';
	description: string | null;
	context: string;
	targetUrl: string | null;
	avatarUrl: string | null;
	isRequired: boolean;
}

export interface CheckRun {
	__typename: string;
	id: string;
	conclusion:
	| 'ACTION_REQUIRED'
	| 'CANCELLED'
	| 'FAILURE'
	| 'NEUTRAL'
	| 'SKIPPED'
	| 'STALE'
	| 'SUCCESS'
	| 'TIMED_OUT'
	| null;
	name: string;
	title: string | null;
	detailsUrl: string | null;
	checkSuite?: {
		app: {
			logoUrl: string;
			url: string;
		} | null;
		workflowRun?: {
			event: string;
			workflow: {
				name: string;
			};
		};
	};
	isRequired: boolean;
}

export function isCheckRun(x: CheckRun | StatusContext): x is CheckRun {
	return x.__typename === 'CheckRun';
}

export interface ChecksReviewNode {
	authorAssociation: 'MEMBER' | 'OWNER' | 'MANNEQUIN' | 'COLLABORATOR' | 'CONTRIBUTOR' | 'FIRST_TIME_CONTRIBUTOR' | 'FIRST_TIMER' | 'NONE';
	authorCanPushToRepository: boolean
	state: 'PENDING' | 'COMMENTED' | 'APPROVED' | 'CHANGES_REQUESTED' | 'DISMISSED';
	author: {
		login: string;
	}
}

export interface GetChecksResponse {
	repository: {
		pullRequest: {
			url: string;
			latestReviews: {
				nodes: ChecksReviewNode[];
			};
			reviewsRequestingChanges: {
				nodes: ChecksReviewNode[];
			};
			baseRef: {
				refUpdateRule: {
					requiredApprovingReviewCount: number | null;
					requiredStatusCheckContexts: string[] | null;
					requiresCodeOwnerReviews: boolean;
					viewerCanPush: boolean;
				} | null;
			} | null;
			commits: {
				nodes: {
					commit: {
						statusCheckRollup?: {
							state: 'EXPECTED' | 'ERROR' | 'FAILURE' | 'PENDING' | 'SUCCESS';
							contexts: {
								nodes: (StatusContext | CheckRun)[];
							};
						};
					};
				}[] | undefined;
			};
		};
	} | null;
}

export interface ResolveReviewThreadResponse {
	resolveReviewThread: {
		thread: ReviewThread;
	}
}

export interface UnresolveReviewThreadResponse {
	unresolveReviewThread: {
		thread: ReviewThread;
	}
}

export interface PullRequestFilesResponse {
	repository: {
		pullRequest: {
			files: {
				nodes: {
					path: string;
					viewerViewedState: ViewedState
				}[]
				pageInfo: {
					hasNextPage: boolean;
					endCursor: string;
				};
			}
		}
	} | null;
}

export interface MergePullRequestInput {
	pullRequestId: string;
	mergeMethod: MergeMethod;
	authorEmail?: string;
	commitBody?: string;
	commitHeadline?: string;
	expectedHeadOid?: string;
}

export interface MergePullRequestResponse {
	mergePullRequest: {
		pullRequest: PullRequest & {
			timelineItems: {
				nodes: (MergedEvent | Review | IssueComment | Commit | AssignedEvent | HeadRefDeletedEvent)[]
			}
		};
	}
}
