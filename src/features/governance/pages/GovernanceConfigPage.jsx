import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  useGovernanceConfig,
  useGovernanceHistory,
  useSaveGovernanceConfig,
} from '../hooks/useGovernance'
import GovernanceConfigEditor from '../components/GovernanceConfigEditor'
import Loader from '../../../components/shared/Loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Badge } from '../../../components/ui/badge'
import { formatDate } from '../../../utils/date.util'

export default function GovernanceConfigPage() {
  const { scopeId } = useParams()

  const { data: config,  isLoading: loadingConfig  } = useGovernanceConfig(scopeId)
  const { data: history, isLoading: loadingHistory } = useGovernanceHistory(scopeId)

  const { mutate: save, isPending: saving } = useSaveGovernanceConfig(scopeId)

  if (loadingConfig) return <Loader text="Loading governance config..." />

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/governance"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Governance
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Governance Config</h1>
        {config && (
          <p className="text-sm text-muted-foreground mt-1">
            Version {config.version} · Active since{' '}
            {formatDate(config.effectiveFrom)}
          </p>
        )}
        {!config && (
          <p className="text-sm text-muted-foreground mt-1">
            No config found for this scope. Create the first one below.
          </p>
        )}
      </div>

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">
            {config ? 'Edit Config' : 'Create Config'}
          </TabsTrigger>
          <TabsTrigger value="history">
            Version History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          <div className="rounded-lg border bg-card p-6">
            <GovernanceConfigEditor
              scopeId={scopeId}
              existingConfig={config ?? null}
              onSave={save}
              isSaving={saving}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {loadingHistory ? (
            <Loader size="sm" />
          ) : !history?.length ? (
            <div className="rounded-lg border bg-muted/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">No version history yet.</p>
            </div>
          ) : (
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    {['Version', 'Status', 'Effective From', 'Steps'].map(h => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-medium text-muted-foreground text-xs"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map(v => (
                    <tr key={v._id} className="border-t">
                      <td className="px-4 py-3 font-medium text-foreground">
                        v{v.version}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={v.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {v.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(v.effectiveFrom)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {v.approvalWorkflow?.length ?? 0} steps
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}