import DashboardController from './DashboardController'
import TransactionController from './TransactionController'
import HouseholdController from './HouseholdController'
import BudgetController from './BudgetController'
import RecurringTransactionController from './RecurringTransactionController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
TransactionController: Object.assign(TransactionController, TransactionController),
HouseholdController: Object.assign(HouseholdController, HouseholdController),
BudgetController: Object.assign(BudgetController, BudgetController),
RecurringTransactionController: Object.assign(RecurringTransactionController, RecurringTransactionController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers