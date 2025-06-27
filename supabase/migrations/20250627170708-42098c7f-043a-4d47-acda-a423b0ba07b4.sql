
-- Enable RLS on operations table
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own operations
CREATE POLICY "Users can view their own operations" ON public.operations
  FOR SELECT USING (
    portfolio_id IN (
      SELECT id FROM public.portfolios WHERE user_id = auth.uid()
    )
  );

-- Policy for users to insert their own operations
CREATE POLICY "Users can create their own operations" ON public.operations
  FOR INSERT WITH CHECK (
    portfolio_id IN (
      SELECT id FROM public.portfolios WHERE user_id = auth.uid()
    )
  );

-- Policy for users to update their own operations
CREATE POLICY "Users can update their own operations" ON public.operations
  FOR UPDATE USING (
    portfolio_id IN (
      SELECT id FROM public.portfolios WHERE user_id = auth.uid()
    )
  );

-- Policy for users to delete their own operations
CREATE POLICY "Users can delete their own operations" ON public.operations
  FOR DELETE USING (
    portfolio_id IN (
      SELECT id FROM public.portfolios WHERE user_id = auth.uid()
    )
  );

-- Enable RLS on portfolios table if not already enabled
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own portfolios
CREATE POLICY "Users can view their own portfolios" ON public.portfolios
  FOR SELECT USING (user_id = auth.uid());

-- Policy for users to create their own portfolios
CREATE POLICY "Users can create their own portfolios" ON public.portfolios
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own portfolios
CREATE POLICY "Users can update their own portfolios" ON public.portfolios
  FOR UPDATE USING (user_id = auth.uid());

-- Policy for users to delete their own portfolios
CREATE POLICY "Users can delete their own portfolios" ON public.portfolios
  FOR DELETE USING (user_id = auth.uid());
