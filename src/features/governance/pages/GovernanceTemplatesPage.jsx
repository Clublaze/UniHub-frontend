import { Link } from 'react-router-dom'
import { useGovernanceTemplates } from '../hooks/useGovernance'
import Loader from '../../../components/shared/Loader'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'

export default function GovernanceTemplatesPage() {
  const { data: templates = [], isLoading } = useGovernanceTemplates()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Governance Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pre-built approval workflow templates. Use one as a starting point
          when configuring governance for a new club or society.
        </p>
      </div>

      {isLoading ? (
        <Loader text="Loading templates..." />
      ) : templates.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No templates available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t._id} className="h-full">
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{t.templateName}</h3>
                  {t.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.description}
                    </p>
                  )}
                </div>

                {/* Approval chain preview */}
                {t.approvalWorkflow?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      Approval Chain ({t.approvalWorkflow.length} steps)
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {t.approvalWorkflow
                        .sort((a, b) => a.stepOrder - b.stepOrder)
                        .map((step, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {step.canonicalRole.replace(/_/g, ' ')}
                            </Badge>
                            {i < t.approvalWorkflow.length - 1 && (
                              <span className="text-muted-foreground text-xs">→</span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Default rules */}
                {t.defaultRules && (
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>Min notice: {t.defaultRules.minimumNoticeDays ?? 15} days</p>
                    <p>Budget required: {t.defaultRules.requiresBudgetApproval ? 'Yes' : 'No'}</p>
                    <p>ECR deadline: {t.defaultRules.ecrDeadlineDays ?? 3} days after event</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          To apply a template to a club or society, go to{' '}
          <Link to="/governance" className="text-primary hover:underline">
            Governance Config
          </Link>{' '}
          and select the scope you want to configure.
        </p>
      </div>
    </div>
  )
}