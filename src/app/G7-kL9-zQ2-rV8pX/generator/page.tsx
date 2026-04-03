
"use client";

import { useState } from 'react';
import { generatePastryDescription } from '@/ai/flows/generate-pastry-description-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pastryName: '',
    keywords: '',
    length: 'medium' as 'short' | 'medium' | 'long'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pastryName) return;

    setLoading(true);
    try {
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k !== '');
      const response = await generatePastryDescription({
        pastryName: formData.pastryName,
        keywords: keywordsArray,
        length: formData.length
      });
      setResult(response.description);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate description. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Description copied to clipboard."
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl" dir="rtl">
      <div className="mb-10 text-center relative">
        <Link href="/G7-kL9-zQ2-rV8pX" className="absolute right-0 top-0 text-primary hover:underline flex items-center gap-1 text-sm font-bold">
          <ArrowRight className="h-4 w-4 rotate-180" /> العودة للوحة الإدارة
        </Link>
        <h1 className="text-4xl font-headline text-primary mb-2">أداة وصف المنتجات الذكية</h1>
        <p className="text-muted-foreground">أداة داخلية تعمل بالذكاء الاصطناعي لكتابة نصوص جذابة لـ dhawa9ni.tn.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border text-right">
          <CardHeader>
            <CardTitle className="text-xl">مدخلات المولد</CardTitle>
            <CardDescription>تفاصيل عن الحلويات لإلهام الذكاء الاصطناعي.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pastryName">اسم المنتج</Label>
                <Input 
                  id="pastryName" 
                  placeholder="مثال: كعك ورقة زغوان" 
                  value={formData.pastryName}
                  onChange={(e) => setFormData({...formData, pastryName: e.target.value})}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">كلمات مفتاحية (مفصولة بفاصلة)</Label>
                <Input 
                  id="keywords" 
                  placeholder="مثال: مقرمش، عسل، لوز، ماء ورد" 
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">طول النص المطلوب</Label>
                <Select 
                  value={formData.length} 
                  onValueChange={(v: any) => setFormData({...formData, length: v})}
                >
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر الطول" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">قصير (جملة أو جملتين)</SelectItem>
                    <SelectItem value="medium">متوسط (فقرة)</SelectItem>
                    <SelectItem value="long">طويل (قصة كاملة)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="ml-2 h-4 w-4" />
                    توليد الوصف
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-secondary/10 flex flex-col h-full text-right">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">النتيجة</CardTitle>
              <CardDescription>النص الإبداعي المولد.</CardDescription>
            </div>
            {result && (
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            {result ? (
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed animate-in fade-in zoom-in duration-300">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 py-20">
                <Sparkles className="h-12 w-12 mb-4" />
                <p>املأ التفاصيل لترى السحر.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
